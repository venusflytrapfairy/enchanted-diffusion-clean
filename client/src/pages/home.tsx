import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ImageGenerationSession } from "@shared/schema";

export default function Home() {
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [userFeedback, setUserFeedback] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current session data
  const { data: session, isLoading: sessionLoading } = useQuery<ImageGenerationSession>({
    queryKey: ["/api/sessions", currentSessionId],
    enabled: !!currentSessionId,
  });

  // Create new session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await apiRequest("POST", "/api/sessions", {
        userPrompt: prompt,
        status: "prompt"
      });
      return response.json();
    },
    onSuccess: (newSession) => {
      setCurrentSessionId(newSession.id);
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive",
      });
    },
  });

  // Generate description mutation
  const generateDescriptionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/generate-description`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", currentSessionId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate description",
        variant: "destructive",
      });
    },
  });

  // Refine description mutation
  const refineDescriptionMutation = useMutation({
    mutationFn: async ({ sessionId, feedback }: { sessionId: number; feedback: string }) => {
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/refine-description`, {
        userFeedback: feedback
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", currentSessionId] });
      setUserFeedback("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to refine description",
        variant: "destructive",
      });
    },
  });

  // Generate image mutation
  const generateImageMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/generate-image`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", currentSessionId] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate image",
        variant: "destructive",
      });
    },
  });

  const handleStartNewSession = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }
    await createSessionMutation.mutateAsync(userPrompt);
  };

  const handleGenerateDescription = async () => {
    if (!currentSessionId) return;
    await generateDescriptionMutation.mutateAsync(currentSessionId);
  };

  const handleRefineDescription = async () => {
    if (!currentSessionId || !userFeedback.trim()) return;
    await refineDescriptionMutation.mutateAsync({
      sessionId: currentSessionId,
      feedback: userFeedback
    });
  };

  const handleApproveDescription = async () => {
    if (!currentSessionId) return;
    await generateImageMutation.mutateAsync(currentSessionId);
  };

  const handleCreateAnother = () => {
    setCurrentSessionId(null);
    setUserPrompt("");
    setUserFeedback("");
  };

  const isLoading = createSessionMutation.isPending || 
                   generateDescriptionMutation.isPending || 
                   refineDescriptionMutation.isPending || 
                   generateImageMutation.isPending;

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Star Field Background */}
      <div className="star-field">
        <div className="star" style={{ top: "20%", left: "10%", animationDelay: "0s" }}></div>
        <div className="star" style={{ top: "30%", left: "80%", animationDelay: "1s" }}></div>
        <div className="star" style={{ top: "60%", left: "20%", animationDelay: "2s" }}></div>
        <div className="star" style={{ top: "80%", left: "70%", animationDelay: "1.5s" }}></div>
        <div className="star" style={{ top: "10%", left: "60%", animationDelay: "3s" }}></div>
        <div className="star" style={{ top: "50%", left: "90%", animationDelay: "0.5s" }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-cyber font-black holographic mb-4 animate-glow">
              💖 AI Image Gen 2K 💖
            </h1>
            <p className="text-xl md:text-2xl text-bubble-pink font-light tracking-wide">
              sustainable • AI x Human collaboration ✨
            </p>
            <div className="flex justify-center items-center mt-6 space-x-4">
              <div className="flex items-center glass-effect px-4 py-2 rounded-full">
                <span className="text-lime-pop mr-2">🌸</span>
                <span className="text-sm text-bubble-pink">Eco-Friendly</span>
              </div>
              <div className="flex items-center glass-effect px-4 py-2 rounded-full">
                <span className="text-cyber-pink mr-2">💫</span>
                <span className="text-sm text-candy-pink">AI Powered</span>
              </div>
              <div className="flex items-center glass-effect px-4 py-2 rounded-full">
                <span className="text-princess-purple mr-2">💕</span>
                <span className="text-sm text-barbie-pink">Collaborative</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Workflow Visualization */}
      <section className="relative z-10 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-cyber font-bold text-center mb-12 holographic">
            💫 The Future of AI Image Generation 💫
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="workflow-step text-center">
              <div className="glass-effect neon-border rounded-3xl p-6 h-full transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyber-pink to-electric-purple flex items-center justify-center animate-pulse-slow">
                  <i className="fas fa-keyboard text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-cyber font-bold mb-2 text-cyber-pink">✨ PROMPT ✨</h3>
                <p className="text-sm text-bubble-pink">Share your image vision</p>
              </div>
            </div>
            <div className="workflow-step text-center">
              <div className="glass-effect neon-border rounded-3xl p-6 h-full transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-cyan to-lime-pop flex items-center justify-center animate-pulse-slow">
                  <i className="fas fa-brain text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-cyber font-bold mb-2 text-candy-pink">💖 DESCRIBE 💖</h3>
                <p className="text-sm text-princess-purple">AI creates magical description</p>
              </div>
            </div>
            <div className="workflow-step text-center">
              <div className="glass-effect neon-border rounded-3xl p-6 h-full transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-electric-purple to-cyber-pink flex items-center justify-center animate-pulse-slow">
                  <i className="fas fa-thumbs-up text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-cyber font-bold mb-2 text-electric-purple">🌟 APPROVE 🌟</h3>
                <p className="text-sm text-candy-pink">Review and make it perfect</p>
              </div>
            </div>
            <div className="workflow-step text-center">
              <div className="glass-effect neon-border rounded-3xl p-6 h-full transform hover:scale-105 transition-all duration-300">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-lime-pop to-neon-cyan flex items-center justify-center animate-pulse-slow">
                  <i className="fas fa-image text-3xl text-white"></i>
                </div>
                <h3 className="text-xl font-cyber font-bold mb-2 text-lime-pop">✨ GENERATE ✨</h3>
                <p className="text-sm text-barbie-pink">Perfect image, first try!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interface */}
      <main className="relative z-10 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          
          {/* Step 1: Prompt Input */}
          {(!session || session.status === "prompt") && (
            <Card className="glass-effect rounded-3xl p-8 mb-8 neon-border">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-pink to-electric-purple flex items-center justify-center mr-4 animate-glow">
                    <span className="text-2xl font-cyber font-black">1</span>
                  </div>
                  <h2 className="text-3xl font-cyber font-bold holographic">✨ Tell me your image vision ✨</h2>
                </div>
                
                <div className="relative mb-6">
                  <Textarea 
                    className="retro-input w-full h-32 px-6 py-4 text-lg resize-none placeholder-gray-400"
                    placeholder="Describe the image you want to create... ✨"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    maxLength={500}
                  />
                  <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                    <span>{userPrompt.length}</span>/500 characters
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-cyber-pink via-electric-purple to-neon-cyan text-white py-4 px-8 rounded-2xl font-cyber font-bold text-xl transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                  onClick={currentSessionId ? handleGenerateDescription : handleStartNewSession}
                  disabled={isLoading || !userPrompt.trim()}
                >
                  <i className="fas fa-magic mr-3"></i>
                  {currentSessionId ? "Generate AI Description" : "Start Generation"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: AI Description & Feedback */}
          {session && (session.status === "describing" || session.status === "feedback") && (
            <Card className="glass-effect rounded-3xl p-8 mb-8 neon-border">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-neon-cyan to-lime-pop flex items-center justify-center mr-4 animate-glow">
                    <span className="text-2xl font-cyber font-black">2</span>
                  </div>
                  <h2 className="text-3xl font-cyber font-bold holographic">AI's Vision</h2>
                </div>
                
                {/* Loading State */}
                {session.status === "describing" && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyber-pink border-opacity-75"></div>
                    <span className="ml-4 text-xl font-cyber">Analyzing your vision...</span>
                  </div>
                )}
                
                {/* AI Description */}
                {session.aiDescription && (
                  <>
                    <div className="bg-black bg-opacity-30 rounded-2xl p-6 mb-6 border-2 border-neon-cyan">
                      <h3 className="text-lg font-cyber font-bold text-neon-cyan mb-3">
                        <i className="fas fa-robot mr-2"></i>
                        {session.userFeedback ? "Refined AI Description:" : "AI Description:"}
                      </h3>
                      <p className="text-lg leading-relaxed text-gray-100">
                        {session.aiDescription}
                      </p>
                      {session.userFeedback && (
                        <div className="mt-4 pt-4 border-t border-electric-purple border-opacity-30">
                          <p className="text-sm text-electric-purple mb-2">
                            <i className="fas fa-edit mr-1"></i>Your feedback: "{session.userFeedback}"
                          </p>
                          <p className="text-xs text-gray-400">
                            The description above has been refined based on your feedback.
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Feedback Interface */}
                    <div className="space-y-4 mb-6">
                      <h3 className="text-xl font-cyber font-bold text-electric-purple">
                        <i className="fas fa-edit mr-2"></i>Refine the Description:
                      </h3>
                      <Textarea 
                        className="retro-input w-full h-24 px-4 py-3 text-base resize-none"
                        placeholder="Add details, corrections, or modifications..."
                        value={userFeedback}
                        onChange={(e) => setUserFeedback(e.target.value)}
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button 
                        className="bg-gradient-to-r from-lime-pop to-neon-cyan text-white py-3 px-6 rounded-xl font-cyber font-bold transform hover:scale-105 transition-all duration-300"
                        onClick={handleApproveDescription}
                        disabled={isLoading}
                      >
                        <i className="fas fa-check mr-2"></i>
                        Perfect! Generate Image
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-electric-purple to-cyber-pink text-white py-3 px-6 rounded-xl font-cyber font-bold transform hover:scale-105 transition-all duration-300"
                        onClick={handleRefineDescription}
                        disabled={isLoading || !userFeedback.trim()}
                      >
                        <i className="fas fa-sync mr-2"></i>
                        {refineDescriptionMutation.isPending ? "Refining..." : "Refine Description"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Image Generation */}
          {session && (session.status === "generating" || session.status === "completed" || generateImageMutation.isPending) && (
            <Card className="glass-effect rounded-3xl p-8 mb-8 neon-border">
              <CardContent className="p-0">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-lime-pop to-neon-cyan flex items-center justify-center mr-4 animate-glow">
                    <span className="text-2xl font-cyber font-black">3</span>
                  </div>
                  <h2 className="text-3xl font-cyber font-bold holographic">Creating Your Magic</h2>
                </div>
                
                {/* Generation Progress - Show when generating OR when mutation is pending */}
                {(session?.status === "generating" || generateImageMutation.isPending) && (
                  <div className="mb-8">
                    <div className="bg-black bg-opacity-30 rounded-2xl p-6 neon-border">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-cyber text-lg text-neon-cyan">AI Image Generation</span>
                        <span className="text-electric-purple font-cyber animate-pulse">Processing...</span>
                      </div>
                      
                      {/* Animated Progress Bar */}
                      <div className="w-full bg-gray-700 rounded-full h-4 mb-4 overflow-hidden relative">
                        <div className="h-full bg-gradient-to-r from-cyber-pink via-electric-purple to-neon-cyan rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rounded-full animate-bounce-gentle"></div>
                      </div>
                      
                      {/* Generation Status */}
                      <div className="text-center mb-4">
                        <div className="flex items-center justify-center mb-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-cyber-pink mr-3"></div>
                          <p className="text-gray-300 font-cyber">Stable Diffusion is creating your masterpiece...</p>
                        </div>
                        
                        {/* Final Description Being Used */}
                        <div className="bg-electric-purple bg-opacity-20 rounded-lg p-4 mb-4">
                          <h4 className="text-sm font-cyber text-electric-purple mb-2">
                            <i className="fas fa-magic mr-1"></i>Using Description:
                          </h4>
                          <p className="text-xs text-gray-300 leading-relaxed">
                            {session.finalDescription || session.aiDescription}
                          </p>
                        </div>
                      </div>
                      
                      {/* Environmental Impact */}
                      <div className="flex items-center justify-center space-x-6 text-sm">
                        <div className="flex items-center text-lime-pop">
                          <i className="fas fa-leaf mr-2"></i>
                          <span>Energy Optimized</span>
                        </div>
                        <div className="flex items-center text-neon-cyan">
                          <i className="fas fa-recycle mr-2"></i>
                          <span>Sustainable AI</span>
                        </div>
                        <div className="flex items-center text-cyber-pink">
                          <i className="fas fa-heart mr-2"></i>
                          <span>Human-Approved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Generated Image Display */}
                {session.status === "completed" && session.generatedImageUrl && (
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img 
                        src={session.generatedImageUrl}
                        alt="Generated AI image"
                        className="rounded-2xl shadow-2xl max-w-full h-auto neon-border animate-glow"
                        onError={(e) => {
                          console.error("Image failed to load:", session.generatedImageUrl);
                          e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAyNCIgaGVpZ2h0PSIxMDI0IiBmaWxsPSIjZmY2OWI0Ii8+Cjx0ZXh0IHg9IjUxMiIgeT0iNTEyIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2UgR2VuZXJhdGVkPC90ZXh0Pgo8L3N2Zz4K";
                        }}
                        onLoad={() => {
                          console.log("Image loaded successfully:", session.generatedImageUrl);
                        }}
                      />
                      <div className="absolute top-4 right-4 bg-black bg-opacity-60 rounded-lg px-3 py-2">
                        <span className="text-xs font-cyber text-lime-pop">
                          <i className="fas fa-leaf mr-1"></i>Eco-Generated
                        </span>
                      </div>
                    </div>
                    
                    {/* Image Actions */}
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                      <Button 
                        className="bg-gradient-to-r from-cyber-pink to-electric-purple text-white py-3 px-6 rounded-xl font-cyber font-bold transform hover:scale-105 transition-all duration-300"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = session.generatedImageUrl!;
                          link.download = 'ai-generated-image.png';
                          link.click();
                        }}
                      >
                        <i className="fas fa-download mr-2"></i>Download
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-neon-cyan to-lime-pop text-white py-3 px-6 rounded-xl font-cyber font-bold transform hover:scale-105 transition-all duration-300"
                        onClick={() => {
                          navigator.share?.({
                            title: 'AI Generated Image',
                            url: session.generatedImageUrl
                          }).catch(() => {
                            navigator.clipboard.writeText(session.generatedImageUrl!);
                            toast({ title: "Link copied to clipboard!" });
                          });
                        }}
                      >
                        <i className="fas fa-share mr-2"></i>Share
                      </Button>
                      <Button 
                        className="bg-gradient-to-r from-electric-purple to-cyber-pink text-white py-3 px-6 rounded-xl font-cyber font-bold transform hover:scale-105 transition-all duration-300"
                        onClick={handleCreateAnother}
                      >
                        <i className="fas fa-redo mr-2"></i>Create Another
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Resource Tracker */}
      {session?.status === "completed" && (
        <section className="relative z-10 py-12">
          <div className="container mx-auto px-6">
            <Card className="glass-effect rounded-3xl p-8 neon-border">
              <CardContent className="p-0">
                <h2 className="text-3xl font-cyber font-bold text-center mb-8 holographic">
                  <i className="fas fa-chart-line mr-3"></i>Impact Dashboard
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-lime-pop to-neon-cyan flex items-center justify-center animate-pulse-slow">
                      <i className="fas fa-leaf text-4xl text-white"></i>
                    </div>
                    <h3 className="text-2xl font-cyber font-bold text-lime-pop mb-2">Energy Saved</h3>
                    <p className="text-4xl font-cyber font-black holographic">{session.energySaved}%</p>
                    <p className="text-sm text-gray-400">vs traditional generation</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyber-pink to-electric-purple flex items-center justify-center animate-pulse-slow">
                      <i className="fas fa-clock text-4xl text-white"></i>
                    </div>
                    <h3 className="text-2xl font-cyber font-bold text-cyber-pink mb-2">Time Saved</h3>
                    <p className="text-4xl font-cyber font-black holographic">{session.timeSaved}min</p>
                    <p className="text-sm text-gray-400">average per session</p>
                  </div>
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-neon-cyan to-electric-purple flex items-center justify-center animate-pulse-slow">
                      <i className="fas fa-heart text-4xl text-white"></i>
                    </div>
                    <h3 className="text-2xl font-cyber font-bold text-neon-cyan mb-2">Satisfaction</h3>
                    <p className="text-4xl font-cyber font-black holographic">94%</p>
                    <p className="text-sm text-gray-400">first-try success rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-electric-purple border-opacity-30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center mb-6 space-x-8">
            <div className="flex items-center text-sm">
              <i className="fas fa-robot text-cyber-pink mr-2"></i>
              <span>Powered by Hugging Face</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="fas fa-image text-neon-cyan mr-2"></i>
              <span>Stable Diffusion 3.5</span>
            </div>
            <div className="flex items-center text-sm">
              <i className="fas fa-code text-lime-pop mr-2"></i>
              <span>React Frontend</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Made with 💖 for the planet and creativity
          </p>
        </div>
      </footer>
    </div>
  );
}
