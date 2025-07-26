import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ImageGenerationSession } from "@shared/schema";

// Floating background elements component
const FloatingElements = () => {
  const elements = ['🧚', '🦋', '🌸', '🍄', '✨', '🌙', '⭐', '🌿', '🍄', '✨', '🌟', '🌺'];
  const positions = [
    { left: '10%', top: '20%' }, { left: '85%', top: '15%' }, { left: '75%', top: '35%' },
    { left: '20%', top: '60%' }, { left: '90%', top: '70%' }, { left: '15%', top: '80%' },
    { left: '60%', top: '25%' }, { left: '40%', top: '85%' }, { left: '70%', top: '60%' },
    { left: '25%', top: '40%' }, { left: '50%', top: '10%' }, { left: '5%', top: '45%' }
  ];
  
  return (
    <>
      {elements.map((element, index) => (
        <div
          key={index}
          className="floating-bg"
          style={{
            left: positions[index]?.left || `${Math.random() * 100}%`,
            top: positions[index]?.top || `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        >
          {element}
        </div>
      ))}
    </>
  );
};

// Fairy guide component
const FairyGuide = ({ message, isVisible }: { message: string; isVisible: boolean }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-8 right-8 z-50 fairy-guide">
      <div className="glass-fairy rounded-2xl p-4 max-w-xs shadow-lg border border-fairy-pink border-opacity-30">
        <div className="flex items-start gap-3">
          <span className="text-3xl animate-bounce">🧚</span>
          <p className="text-sm font-fairy text-foreground font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Moonbeam tasks component
const MoonbeamMissions = ({ sessionId }: { sessionId: number | null }) => {
  const [moonbeams, setMoonbeams] = useState(() => {
    return parseInt(localStorage.getItem('moonbeams') || '0');
  });
  const [claimedTasks, setClaimedTasks] = useState<number[]>(() => {
    return JSON.parse(localStorage.getItem('claimedTasks') || '[]');
  });

  const tasks = [
    { id: 1, label: "Delete 50 unread emails", description: "Reduce the strain on data centers and lower the associated carbon emissions", reward: 5 },
    { id: 2, label: "Close unused browser tabs", description: "Lowers device CPU use", reward: 2 },
    { id: 3, label: "Switch to dark mode", description: "Saves screen energy", reward: 3 },
    { id: 4, label: "Use a local image instead", description: "Avoids API compute", reward: 10 },
    { id: 5, label: "Clear recycle bin", description: "Frees up storage", reward: 2 },
  ];

  const { toast } = useToast();

  const claimTask = (taskId: number, reward: number) => {
    if (!claimedTasks.includes(taskId)) {
      const newMoonbeams = moonbeams + reward;
      setMoonbeams(newMoonbeams);
      setClaimedTasks([...claimedTasks, taskId]);
      localStorage.setItem('moonbeams', newMoonbeams.toString());
      localStorage.setItem('claimedTasks', JSON.stringify([...claimedTasks, taskId]));
      
      toast({
        title: `✨ You've earned ${reward} Moonbeams!`,
        description: "The stars smile upon your efforts.",
      });
    }
  };

  return (
    <Card className="glass-fairy rounded-3xl">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-magical fairycore-text mb-2">🌙 Moonbeam Missions</h3>
          <div className="flex items-center justify-center gap-2 moonbeam-glow">
            <span className="text-lg">🌙</span>
            <span className="text-2xl font-bold text-stardust">{moonbeams}</span>
            <span className="text-sm font-fairy">moonbeams collected</span>
          </div>
        </div>
        
        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-3 glass-fairy rounded-xl">
              <div className="flex-1">
                <p className="font-fairy font-medium text-foreground">{task.label}</p>
                <p className="text-xs text-muted-foreground">{task.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-stardust">+{task.reward} 🌙</span>
                <Button
                  size="sm"
                  disabled={claimedTasks.includes(task.id)}
                  onClick={() => claimTask(task.id, task.reward)}
                  className="bg-gradient-to-r from-fairy-pink to-stardust text-white font-fairy"
                >
                  {claimedTasks.includes(task.id) ? 'Claimed ✨' : 'Claim'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Magical progress component
const MagicalProgress = ({ progress, stage }: { progress: number; stage: string }) => {
  const stages = [
    "Connecting to the Enchanted Compute Grove...",
    "Magic routed through the Forest of Finland 🏞️",
    "Passing through Cloud City 🌩️",
    "Weaving dreams into reality ✨",
    "Almost there, the fairies are working... 🧚"
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="font-fairy text-lg fairycore-text mb-2">{stage}</p>
        <div className="relative">
          <Progress value={progress} className="h-3 bg-muted" />
          <div 
            className="absolute top-0 left-0 h-3 magical-progress rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-muted-foreground font-fairy">
          {stages[Math.floor((progress / 100) * stages.length)]}
        </p>
      </div>
    </div>
  );
};

export default function Home() {
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [userFeedback, setUserFeedback] = useState("");
  const [fairyMessage, setFairyMessage] = useState("");
  const [showFairy, setShowFairy] = useState(false);
  const [magicalEnergy, setMagicalEnergy] = useState(15); // Start with some magical energy
  const [progressStage, setProgressStage] = useState("");
  const [magicalProgress, setMagicalProgress] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fairyMessages = [
    "The moon approves of your choices... ✨",
    "I saw this in a dream once. Lovely. 🌙",
    "The forest whispers your name... 🌿",
    "Magic flows through your words... 🦋",
    "The stars are aligning perfectly... ⭐",
    "Such beautiful energy you bring... 🧚",
    "The ancient trees speak of your creativity... 🌳",
    "Your vision sparkles like morning dew... 💎",
    "The woodland spirits dance with joy... 🍃",
    "Fairy dust gathers around your dreams... ✨",
  ];

  // Show random fairy messages periodically
  useEffect(() => {
    const showRandomMessage = () => {
      const randomMessage = fairyMessages[Math.floor(Math.random() * fairyMessages.length)];
      showFairyGuide(randomMessage);
    };

    // Show welcome message on load
    const welcomeTimer = setTimeout(() => {
      showFairyGuide("Welcome to our enchanted realm... 🧚✨");
    }, 2000);

    // Show random messages every 30 seconds when no session is active
    const messageInterval = setInterval(() => {
      if (!currentSessionId && !showFairy) {
        showRandomMessage();
      }
    }, 30000);

    return () => {
      clearTimeout(welcomeTimer);
      clearInterval(messageInterval);
    };
  }, [currentSessionId, showFairy]);

  const showFairyGuide = (message: string) => {
    setFairyMessage(message);
    setShowFairy(true);
    setTimeout(() => setShowFairy(false), 4000);
  };

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
        status: "prompt",
        magicalEnergyUsed: 5,
      });
      return response.json();
    },
    onSuccess: (newSession) => {
      setCurrentSessionId(newSession.id);
      setMagicalEnergy(prev => Math.max(0, prev - 5));
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      const messages = [
        "A new magical journey begins... 🌟",
        "The spirits have heard your whisper... 🧚",
        "Your creative energy awakens the forest... 🌿"
      ];
      showFairyGuide(messages[Math.floor(Math.random() * messages.length)]);
    },
    onError: () => {
      toast({
        title: "Oh no!",
        description: "The magical portal seems blocked...",
        variant: "destructive",
      });
    },
  });

  // Generate description mutation
  const generateDescriptionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      setProgressStage("Whispering to the forest spirits...");
      setMagicalProgress(20);
      
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/generate-description`);
      return response.json();
    },
    onSuccess: () => {
      setMagicalProgress(100);
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", currentSessionId] });
      const messages = [
        "The spirits have spoken beautifully! ✨",
        "I saw this vision in the stars... 🌟",
        "The forest magic flows through these words... 🍃"
      ];
      showFairyGuide(messages[Math.floor(Math.random() * messages.length)]);
      setTimeout(() => setMagicalProgress(0), 1000);
    },
    onError: () => {
      setMagicalProgress(0);
      toast({
        title: "The spirits are shy today",
        description: "They need a moment to gather courage...",
        variant: "destructive",
      });
    },
  });

  // Refine description mutation
  const refineDescriptionMutation = useMutation({
    mutationFn: async ({ sessionId, feedback }: { sessionId: number; feedback: string }) => {
      setProgressStage("Refining with stardust...");
      setMagicalProgress(30);
      
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/refine-description`, {
        userFeedback: feedback
      });
      return response.json();
    },
    onSuccess: () => {
      setMagicalProgress(100);
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", currentSessionId] });
      setUserFeedback("");
      setMagicalEnergy(prev => prev + 2); // Reward for refining instead of regenerating
      showFairyGuide("Your wisdom makes the magic stronger! 🌙");
      setTimeout(() => setMagicalProgress(0), 1000);
    },
    onError: () => {
      setMagicalProgress(0);
      toast({
        title: "The refinement ritual needs more focus",
        description: "The mystical energies are scattered...",
        variant: "destructive",
      });
    },
  });

  // Generate image mutation
  const generateImageMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      setProgressStage("Opening the magical gateway...");
      setMagicalProgress(10);
      
      // Simulate the magical journey stages
      const stages = [
        { progress: 25, message: "Magic routed through the Forest of Finland 🏞️" },
        { progress: 50, message: "Passing through Cloud City 🌩️" },
        { progress: 75, message: "Weaving dreams into reality ✨" },
        { progress: 90, message: "Almost there, the fairies are working... 🧚" },
      ];
      
      let stageIndex = 0;
      const interval = setInterval(() => {
        if (stageIndex < stages.length) {
          setMagicalProgress(stages[stageIndex].progress);
          setProgressStage(stages[stageIndex].message);
          stageIndex++;
        } else {
          clearInterval(interval);
        }
      }, 800);
      
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/generate-image`);
      clearInterval(interval);
      return response.json();
    },
    onSuccess: () => {
      setMagicalProgress(100);
      setMagicalEnergy(prev => Math.max(0, prev - 3));
      queryClient.invalidateQueries({ queryKey: ["/api/sessions", currentSessionId] });
      const messages = [
        "Behold! Your vision has taken form! 🌟",
        "I saw this in a dream once. Lovely. 🌙",
        "The moon approves of your choices... ✨",
        "Such beautiful magic you've created... 🧚"
      ];
      showFairyGuide(messages[Math.floor(Math.random() * messages.length)]);
      setTimeout(() => {
        setMagicalProgress(0);
        setProgressStage("");
      }, 2000);
    },
    onError: () => {
      setMagicalProgress(0);
      setProgressStage("");
      toast({
        title: "The magical gateway is closed",
        description: "The ancient servers need a rest...",
        variant: "destructive",
      });
    },
  });

  const handleStartNewSession = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Whisper your dreams",
        description: "The spirits need something to work with...",
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

  const handleGenerateImage = async () => {
    if (!currentSessionId) return;
    await generateImageMutation.mutateAsync(currentSessionId);
  };

  const handleCreateAnother = () => {
    setCurrentSessionId(null);
    setUserPrompt("");
    setUserFeedback("");
    showFairyGuide("Ready for another magical adventure? 🦋");
  };

  const isLoading = createSessionMutation.isPending || 
                   generateDescriptionMutation.isPending || 
                   refineDescriptionMutation.isPending || 
                   generateImageMutation.isPending;

  return (
    <div className="min-h-screen relative">
      <FloatingElements />
      <FairyGuide message={fairyMessage} isVisible={showFairy} />
      
      {/* Header with magical energy bar */}
      <header className="relative z-10 py-8">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <div className="glass-fairy rounded-3xl p-6 mb-4 max-w-4xl mx-auto">
              <h1 className="text-6xl font-magical font-bold">
                <span className="title-emojis">🧚</span> 
                <span className="bg-gradient-to-r from-emerald-500 to-pink-500 bg-clip-text text-transparent">Enchanted Diffusion</span> 
                <span className="title-emojis">✨</span>
              </h1>
            </div>
            <p className="text-lg font-fairy text-muted-foreground max-w-2xl mx-auto">
              Where human dreams dance with AI magic to create enchanted images
            </p>
          </div>
          
          {/* Magical Energy Bar */}
          <div className="max-w-md mx-auto glass-fairy rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-fairy text-sm">🌿 Forest Light</span>
              <span className="font-bold text-forest-green">{magicalEnergy} drops</span>
            </div>
            <div className="mana-bar h-3 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-forest-green to-sage-green rounded-full transition-all duration-300"
                style={{ width: `${(magicalEnergy / 20) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2 font-fairy">
              Each image uses magical computational resources — let's use magic thoughtfully ✨
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {!currentSessionId ? (
            /* Initial Prompt Stage */
            <Card className="glass-fairy rounded-3xl">
              <CardContent className="p-8">
                <h2 className="text-3xl font-magical font-bold text-center fairycore-text mb-8">
                  Whisper Your Vision to the Forest 🌿
                </h2>
                
                <div className="space-y-6">
                  <Textarea
                    placeholder="Tell the forest spirits what magical scene you envision... 🦋"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="min-h-32 font-fairy text-lg glass-fairy border-dusty-rose"
                    disabled={isLoading}
                  />
                  
                  <div className="text-center">
                    <Button
                      onClick={handleStartNewSession}
                      disabled={isLoading || !userPrompt.trim()}
                      className="bg-gradient-to-r from-fairy-pink to-stardust hover:from-dusty-rose hover:to-soft-lilac text-white py-4 px-8 rounded-2xl font-fairy text-lg transform hover:scale-105 transition-all duration-300 moonbeam-glow"
                    >
                      {isLoading ? "Awakening the spirits... 🌙" : "Send to the Forest ✨"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Session in Progress */
            <Card className="glass-fairy rounded-3xl">
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* User Prompt Display */}
                  <div>
                    <h3 className="text-xl font-magical font-bold fairycore-text mb-4">🌸 Your Whispered Vision</h3>
                    <div className="glass-fairy rounded-2xl p-4">
                      <p className="font-fairy text-foreground">{session?.userPrompt}</p>
                    </div>
                  </div>

                  {/* AI Description Stage */}
                  {session?.status === "prompt" && (
                    <div className="text-center">
                      <Button
                        onClick={handleGenerateDescription}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-mint to-sage-green hover:from-forest-green hover:to-mint text-white py-4 px-8 rounded-2xl font-fairy text-lg transform hover:scale-105 transition-all duration-300"
                      >
                        {isLoading ? "The spirits are listening... 🧚" : "Ask the Forest Spirits ✨"}
                      </Button>
                    </div>
                  )}

                  {/* Show magical progress */}
                  {isLoading && magicalProgress > 0 && (
                    <div className="my-8">
                      <MagicalProgress progress={magicalProgress} stage={progressStage} />
                    </div>
                  )}

                  {/* AI Description Display */}
                  {session?.aiDescription && (
                    <div>
                      <h3 className="text-xl font-magical font-bold fairycore-text mb-4">
                        🧚 The Spirits' Interpretation
                      </h3>
                      <div className="glass-fairy rounded-2xl p-6">
                        <p className="font-fairy text-foreground leading-relaxed">{session.aiDescription}</p>
                      </div>
                    </div>
                  )}

                  {/* Feedback Stage */}
                  {session?.aiDescription && session.status !== "completed" && !session.generatedImageUrl && (
                    <div>
                      <h3 className="text-xl font-magical font-bold fairycore-text mb-4">
                        🌙 Whisper Your Wishes for Changes
                      </h3>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Tell the spirits how to refine their magic... (optional) 🦋"
                          value={userFeedback}
                          onChange={(e) => setUserFeedback(e.target.value)}
                          className="min-h-24 font-fairy glass-fairy border-dusty-rose"
                          disabled={isLoading}
                        />
                        
                        <div className="flex gap-4 justify-center flex-wrap">
                          {userFeedback.trim() && (
                            <Button
                              onClick={handleRefineDescription}
                              disabled={isLoading}
                              className="bg-gradient-to-r from-stardust to-soft-lilac hover:from-dusty-rose hover:to-stardust text-white py-3 px-6 rounded-2xl font-fairy transform hover:scale-105 transition-all duration-300"
                            >
                              {isLoading ? "Weaving your wishes... ✨" : "Refine with Stardust 🌟"}
                            </Button>
                          )}
                          
                          <Button
                            onClick={handleGenerateImage}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-fairy-pink to-dusty-rose hover:from-soft-lilac hover:to-fairy-pink text-white py-3 px-6 rounded-2xl font-fairy transform hover:scale-105 transition-all duration-300 moonbeam-glow"
                          >
                            {isLoading ? "Opening the magical gateway... 🌈" : "Generate Magical Image 🎨"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Refined Description Display */}
                  {session?.finalDescription && session.finalDescription !== session.aiDescription && (
                    <div>
                      <h3 className="text-xl font-magical font-bold fairycore-text mb-4">
                        ✨ Enhanced by Your Wisdom
                      </h3>
                      <div className="glass-fairy rounded-2xl p-6 border-2 border-stardust">
                        <p className="font-fairy text-foreground leading-relaxed">{session.finalDescription}</p>
                      </div>
                    </div>
                  )}

                  {/* Generated Image Display */}
                  {session?.generatedImageUrl && (
                    <div className="text-center space-y-6">
                      <h3 className="text-2xl font-magical font-bold fairycore-text">
                        🌟 Your Enchanted Creation
                      </h3>
                      
                      <div className="relative inline-block">
                        <img
                          src={session.generatedImageUrl}
                          alt="Generated magical image"
                          className="rounded-3xl shadow-2xl max-w-full h-auto floating-element"
                          style={{ maxHeight: '600px' }}
                        />
                        <div className="absolute top-4 right-4 glass-fairy rounded-lg px-3 py-2">
                          <span className="text-xs font-fairy text-forest-green">
                            🌿 Eco-Generated
                          </span>
                        </div>
                      </div>
                      
                      {/* Image Actions */}
                      <div className="flex flex-wrap justify-center gap-4">
                        <Button 
                          className="bg-gradient-to-r from-fairy-pink to-stardust text-white py-3 px-6 rounded-2xl font-fairy transform hover:scale-105 transition-all duration-300"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = session.generatedImageUrl!;
                            link.download = 'fairy-generated-image.png';
                            link.click();
                          }}
                        >
                          🌸 Download Magic
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-mint to-sage-green text-white py-3 px-6 rounded-2xl font-fairy transform hover:scale-105 transition-all duration-300"
                          onClick={() => {
                            if (navigator.share && session.generatedImageUrl) {
                              navigator.share?.({
                                title: 'My Magical AI Creation',
                                url: session.generatedImageUrl
                              }).catch(() => {
                                if (session.generatedImageUrl) {
                                  navigator.clipboard.writeText(session.generatedImageUrl);
                                  toast({ title: "✨ Magic link copied to clipboard!" });
                                }
                              });
                            }
                          }}
                        >
                          🦋 Share the Magic
                        </Button>
                        <Button 
                          className="bg-gradient-to-r from-stardust to-soft-lilac text-white py-3 px-6 rounded-2xl font-fairy transform hover:scale-105 transition-all duration-300"
                          onClick={handleCreateAnother}
                        >
                          🌙 Create Another
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Moonbeam Missions Panel - Always show */}
          <div className="mt-12">
            <MoonbeamMissions sessionId={currentSessionId} />
          </div>

          {/* Energy Conservation Stats */}
          {session?.status === "completed" && (
            <div className="mt-12">
              <Card className="glass-fairy rounded-3xl">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-magical font-bold text-center fairycore-text mb-8">
                    🌱 Your Magical Impact
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-sage-green to-mint flex items-center justify-center floating-element">
                        <span className="text-4xl">🌿</span>
                      </div>
                      <h3 className="text-2xl font-magical font-bold text-forest-green mb-2">Forest Light Saved</h3>
                      <p className="text-4xl font-magical font-black fairycore-text">{session.energySaved || 15}%</p>
                      <p className="text-sm text-muted-foreground font-fairy">vs traditional generation</p>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-fairy-pink to-stardust flex items-center justify-center floating-element">
                        <span className="text-4xl">⏰</span>
                      </div>
                      <h3 className="text-2xl font-magical font-bold text-fairy-pink mb-2">Time Blessed</h3>
                      <p className="text-4xl font-magical font-black fairycore-text">{session.timeSaved || 12}min</p>
                      <p className="text-sm text-muted-foreground font-fairy">average per magical session</p>
                    </div>
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-stardust to-soft-lilac flex items-center justify-center floating-element">
                        <span className="text-4xl">💖</span>
                      </div>
                      <h3 className="text-2xl font-magical font-bold text-stardust mb-2">Joy Spread</h3>
                      <p className="text-4xl font-magical font-black fairycore-text">98%</p>
                      <p className="text-sm text-muted-foreground font-fairy">magical satisfaction rate</p>
                    </div>
                  </div>
                  
                  <div className="text-center mt-8 glass-fairy rounded-2xl p-4">
                    <p className="font-fairy text-sm text-muted-foreground">
                      💡 Each magical creation uses energy similar to powering 10-20 LED bulbs for an hour.
                      By refining instead of regenerating, you help preserve the forest's energy! 🌳✨
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-dusty-rose border-opacity-30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center mb-6 space-x-8">
            <div className="flex items-center text-sm font-fairy">
              <span className="text-fairy-pink mr-2">🤖</span>
              <span>Powered by Hugging Face</span>
            </div>
            <div className="flex items-center text-sm font-fairy">
              <span className="text-stardust mr-2">🎨</span>
              <span>Stable Diffusion 3.5</span>
            </div>
            <div className="flex items-center text-sm font-fairy">
              <span className="text-forest-green mr-2">🌱</span>
              <span>Sustainable AI Magic</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-fairy">
            Made with 💖 and fairy dust for dreamers who care about our planet
          </p>
        </div>
      </footer>
    </div>
  );
}