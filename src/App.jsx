import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home as HomeIcon, Dumbbell, Clock, Plus, Play,
  Search, ArrowLeft, Volume2, Maximize2, Check, X,
  Menu, Star, Flame, Footprints, ChefHat, Salad, Camera,
  Bell, Share2, Heart, Activity, Sparkles, Send, Upload,
  TrendingUp, Award, Calendar, Users, User, ArrowRight,
  Droplet, ShoppingBag, Trophy, Smile, Coffee, Edit3, PlusCircle,
  Youtube, Sparkle, Zap, Target, Brain, Scan
} from "lucide-react";

// Component Library
import Button from "./components/Button";
import Card from "./components/Card";
import ProgressRing from "./components/ProgressRing";
import Sheet from "./components/Sheet";
import IconBadge from "./components/IconBadge";
import CelebrationBurst from "./components/CelebrationBurst";
import { color, typography, space } from "./design/tokens";

/* ═══════════════════════════════════════════════════════════
   DESIGN SYSTEM & COLOR SYSTEM (FITVA 2.0 LIGHT MODE STYLING)
   ═══════════════════════════════════════════════════════════ */
const C = {
  bg: color.bg,
  appBg: color.bg,
  surface: color.surface,
  surfaceLight: color.surfaceRaised,
  border: color.border,
  accent: color.primary,
  accentOrange: color.warning,
  accentPink: color.error,
  blue: color.secondary,
  text1: color.text1,
  text2: color.text2,
  text3: color.text3,
  shadow: "none",
  btnShadow: "none",
  nutritionShadow: "none"
};

export default function App() {
  // ── App flow: splash → onboarding → avatar_creation → app ──
  const [appFlow, setAppFlow] = useState("splash"); // "splash" | "onboarding" | "avatar_creation" | "app"
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [avatarPhase, setAvatarPhase] = useState("capture"); // "capture" | "processing" | "reveal"

  // Shared spring transition preset
  const SPRING = { type: "spring", stiffness: 300, damping: 30 };

  // Staggered grid entrance variants
  const staggerContainer = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
  const staggerItem = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: SPRING } };

  const [celebration, setCelebration] = useState(null);
  const [tab, setTab] = useState("home"); // home, plan, community, profile
  const [activeOverlay, setActiveOverlay] = useState(null); // 'rex_coach', 'active_workout', 'quick_log', 'nutrition'
  
  // Expandable Metrics Panel (Controlled by clicking Water card)
  const [isMetricsExpanded, setIsMetricsExpanded] = useState(true); // Open by default for immediate view
  const [metricsMode, setMetricsMode] = useState("water"); // 'water' or 'steps'
  const [waterGoalInput, setWaterGoalInput] = useState("2.5");
  const [stepsGoalInput, setStepsGoalInput] = useState("10000");
  const [progressTab, setProgressTab] = useState("workout"); // workout, water, steps, nutrition
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(270); // 04:30
  const [workoutTimer, setWorkoutTimer] = useState(90); // 01:30
  const [appTheme, setAppTheme] = useState("dark"); // 'light' or 'dark'
  const [isOrbExpanded, setIsOrbExpanded] = useState(false);
  const [activeZoneModal, setActiveZoneModal] = useState(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [recentFoodLogs, setRecentFoodLogs] = useState(["Salad", "Chicken Rice", "Protein Shake"]);
  const [scanConfidence, setScanConfidence] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [foodMultiplier, setFoodMultiplier] = useState(1);
  const [lastScannedFoodKey, setLastScannedFoodKey] = useState("salad");
  const [recipeError, setRecipeError] = useState(null);

  // Manual food form fields
  const [manualFoodName, setManualFoodName] = useState("");
  const [manualCalories, setManualCalories] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");

  // Step sensor simulation state
  const [sensorActive, setSensorActive] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0, t: 0 });

  // Nutrition Feature Section States
  const [nutritionTab, setNutritionTab] = useState("analyser"); // 'analyser' or 'creator'
  const [analyzingFood, setAnalyzingFood] = useState(false);
  const [scannedFoodResult, setScannedFoodResult] = useState(null);
  
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [manualIngredientInput, setManualIngredientInput] = useState("");
  const [generatingRecipes, setGeneratingRecipes] = useState(false);
  const [recipesResult, setRecipesResult] = useState(null);

  // Dynamic theme design system mapping
  

  // App Live States
  const [user, setUser] = useState({
    name: "Arjun",
    age: 21,
    height: 175,
    weight: 72,
    goal: "Muscle Gain",
    streak: 12,
    waterGoal: 2.5,
    waterToday: 1.6,
    calGoal: 2000,
    calToday: 1260,
    mindGoal: 10,
    mindToday: 8,
    workoutCompleted: 5,
    workoutTotal: 6,
    setsCompleted: 8,
    setsTotal: 11,
    stepsToday: 4210
  });

  const [chatMessages, setChatMessages] = useState([
    { sender: "rex", text: "Hello Arjun! I noticed you completed 8 of your 11 legs & core sets today. You're at 72% progress. Excellent work!", time: "9:42 AM" },
    { sender: "rex", text: "Would you like me to recommend a quick recovery stretch or a post-workout snack?", time: "9:42 AM" }
  ]);
  const [inputText, setInputText] = useState("");
  
  const [posts, setPosts] = useState([
    { id: "p1", user: "FitRaj_21", caption: "Day 15 transformation — never felt better! 💪", boosts: 24, time: "2h ago" },
    { id: "p2", user: "GymQueen", caption: "Morning cardio done! Streak is alive 🔥", boosts: 18, time: "4h ago" },
    { id: "p3", user: "IronMike", caption: "New PR on deadlifts today — 120kg! 🎯", boosts: 42, time: "6h ago" }
  ]);

  const [alertMsg, setAlertMsg] = useState("");

  const triggerAlert = (msg) => {
    setAlertMsg(msg);
    setTimeout(() => setAlertMsg(""), 3000);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const userMsg = { sender: "user", text: inputText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    setInputText("");
    
    // Simulate Rex reply
    setTimeout(() => {
      let rexText = "That sounds like a solid plan! Keep tracking your meals and stay consistent to hit your daily goal.";
      if (inputText.toLowerCase().includes("snack") || inputText.toLowerCase().includes("eat") || inputText.toLowerCase().includes("food")) {
        rexText = "For post-workout recovery, I recommend a shake with 1 scoop of Whey Protein, 1 banana, and 250ml milk. That gives you ~30g of protein and 350 kcal!";
      } else if (inputText.toLowerCase().includes("stretch") || inputText.toLowerCase().includes("sore") || inputText.toLowerCase().includes("yoga")) {
        rexText = "Let's focus on a 5-minute hamstring and quad stretch to relieve the tension. Breathe deeply and hold each stretch for 30 seconds.";
      }
      const rexMsg = { sender: "rex", text: rexText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages(prev => [...prev, rexMsg]);
    }, 1500);
  };

  // Determine time-of-day greeting (morning vs evening)
  const getGreetingTime = () => {
    const hr = new Date().getHours();
    if (hr >= 5 && hr < 12) return "Morning";
    return "Evening";
  };

  // Water motivation text based on percentage
  const getWaterMotivation = () => {
    const pct = user.waterToday / user.waterGoal;
    if (pct >= 1.0) return "doing great work";
    if (pct >= 0.7) return "good and a little bit";
    if (pct >= 0.5) return "almost there";
    return "need to do better";
  };

  // Shake / Mouse movement velocity tracking for Steps simulation
  const handleMouseMove = (e) => {
    if (!sensorActive || metricsMode !== "steps") return;
    const now = Date.now();
    const dt = now - lastMousePos.current.t;
    if (dt > 50) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = dist / dt;
      if (speed > 1.8) {
        setUser(prev => ({ ...prev, stepsToday: prev.stepsToday + 3 }));
      }
      lastMousePos.current = { x: e.clientX, y: e.clientY, t: now };
    }
  };

  // Mobile Accelerometer Sensor Hook
  useEffect(() => {
    if (!sensorActive || metricsMode !== "steps") return;

    let lastX = null, lastY = null, lastZ = null;
    const threshold = 12.0;

    const handleDeviceMotion = (event) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      if (lastX !== null) {
        const deltaX = Math.abs(acc.x - lastX);
        const deltaY = Math.abs(acc.y - lastY);
        const deltaZ = Math.abs(acc.z - lastZ);
        if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
          setUser(prev => ({ ...prev, stepsToday: prev.stepsToday + 1 }));
        }
      }
      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;
    };

    window.addEventListener("devicemotion", handleDeviceMotion);
    return () => window.removeEventListener("devicemotion", handleDeviceMotion);
  }, [sensorActive, metricsMode]);

  // Ticking Workout Timers hook
  useEffect(() => {
    let interval = null;
    if (activeOverlay === "active_workout" && !isWorkoutPaused) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
        setWorkoutTimer(prev => (prev > 0 ? prev - 1 : 90));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeOverlay, isWorkoutPaused]);

  // Rex Audio Voice Greeting (milestone/mount-triggered)
  useEffect(() => {
    if (activeOverlay === "progress") {
      const text = "Welcome back, Arjun! Ready to conquer today's Recommended Workout? Let's keep that 12-day streak glowing!";
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.pitch = 1.0;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [activeOverlay]);

  // Active workout simulation states
  const [activeExercises, setActiveExercises] = useState([
    { name: "Warm-up stretch", time: "5 min", done: true },
    { name: "Bicycle Kick sets", time: "10 min", done: true },
    { name: "Knee Push Ups", time: "15 min", done: false },
    { name: "Jumping Jacks", time: "10 min", done: false }
  ]);
  const [activeWorkoutProgress, setActiveWorkoutProgress] = useState(50);

  const handleToggleExercise = (idx) => {
    const updated = [...activeExercises];
    updated[idx].done = !updated[idx].done;
    setActiveExercises(updated);
    
    const completed = updated.filter(e => e.done).length;
    const progress = Math.round((completed / updated.length) * 100);
    setActiveWorkoutProgress(progress);

    // Update sets completed on dashboard
    setUser(prev => ({
      ...prev,
      setsCompleted: completed * 2,
      setsTotal: updated.length * 2
    }));
  };

  // Food Analyser Simulation
  const handleSimulateScanFood = (foodKey) => {
    setAnalyzingFood(true);
    setScannedFoodResult(null);
    setScanConfidence(null);
    setScanError(null);
    setShowManualForm(false);
    setFoodMultiplier(1);
    setLastScannedFoodKey(foodKey);

    const foodDatabase = {
      salad: {
        name: "Avocado Caesar Salad",
        calories: 320,
        protein: 8,
        fat: 22,
        carbohydrates: 14,
        fiber: 7,
        sugar: 3,
        sodium: 150,
        grade: "A-",
        tips: "Excellent source of healthy monounsaturated fats and dietary fiber. Perfect clean recovery meal."
      },
      chicken: {
        name: "Grilled Chicken & Jasmine Rice",
        calories: 480,
        protein: 38,
        fat: 8,
        carbohydrates: 62,
        fiber: 2,
        sugar: 1,
        sodium: 320,
        grade: "A",
        tips: "Ideal post-workout meal. High protein helps muscle protein synthesis, carbs replenish glycogen stores."
      },
      shake: {
        name: "Berry Whey Protein Shake",
        calories: 220,
        protein: 26,
        fat: 2,
        carbohydrates: 18,
        fiber: 4,
        sugar: 9,
        sodium: 90,
        grade: "B+",
        tips: "Quick absorption. Great for immediate post-training muscle building."
      }
    };

    setTimeout(() => {
      setAnalyzingFood(false);
      if (foodKey === "shake") {
        setScanError("Analysis failed. Try again.");
      } else if (foodKey === "chicken") {
        setScanConfidence(0.45);
      } else {
        setScanConfidence(0.95);
        setScannedFoodResult(foodDatabase[foodKey]);
        triggerAlert("Food scanner completed analysis! 🥗");
      }
    }, 1500);
  };

  // Recipe Creator Simulation
  const handleAddManualIngredient = () => {
    if (!manualIngredientInput.trim()) return;
    setRecipeIngredients(prev => [...new Set([...prev, manualIngredientInput.trim()])]);
    setManualIngredientInput("");
  };

  const handleSimulateRecipeGeneration = () => {
    if (recipeIngredients.length === 0) {
      triggerAlert("Please scan or add at least one ingredient first!");
      return;
    }
    setGeneratingRecipes(true);
    setRecipesResult(null);
    setRecipeError(null);

    setTimeout(() => {
      setGeneratingRecipes(false);
      const hasFail = recipeIngredients.some(ing => ing.toLowerCase().includes("fail") || ing.toLowerCase().includes("error"));
      if (hasFail) {
        setRecipeError("Couldn't generate recipes. Try again.");
      } else {
        setRecipesResult([
          {
            title: "Avocado Oat Protein Bowl",
            time: "10 mins",
            calories: "340 kcal",
            ingredientsUsed: ["Avocado", "Oats", "Protein Shake"],
            youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            instructions: "Blend protein powder and milk, pour over raw oats, top with avocado slices and berries."
          },
          {
            title: "Healthy Chicken Oats Porridge",
            time: "15 mins",
            calories: "410 kcal",
            ingredientsUsed: ["Oats", "Chicken"],
            youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            instructions: "Boil oats with chicken broth, shred grilled chicken on top, garnish with green onions."
          }
        ]);
        triggerAlert("Rex AI generated 2 recipes! 🥞");
      }
    }, 1500);
  };

  const handleOrbClick = () => {
    if (!isOrbExpanded) {
      setIsOrbExpanded(true);
    }
  };

  const getOrbStyle = () => {
    if (isOrbExpanded) {
      return {
        position: "absolute",
        zIndex: 1100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
        borderRadius: "0px",
        background: appTheme === "dark" ? "#0F0F16" : color.text1,
        cursor: "default",
        display: "flex",
        flexDirection: "column",
        padding: "54px 20px 24px",
        boxSizing: "border-box",
        overflow: "hidden",
        transition: "background-color 0.3s"
      };
    }

    // Collapsed coordinate targets based on tab and active overlay
    let top = "auto";
    let bottom = "92px"; // Home, Community & base level
    let left = "auto";
    let right = "20px";
    let width = 48;
    let height = 48;
    let borderRadius = "50%";

    if (activeOverlay === "active_workout") {
      bottom = "280px";
      right = "16px";
    } else if (activeOverlay === "nutrition" || activeOverlay === "progress") {
      bottom = "92px";
      right = "24px";
    } else if (tab === "plan") {
      bottom = "240px"; // Middle right on Plan tab
    } else if (tab === "profile") {
      bottom = "calc(100% - 160px)"; // Upper right on Profile tab
    }

    return {
      position: "absolute",
      zIndex: 1100,
      top,
      bottom,
      left,
      right,
      width,
      height,
      borderRadius,
      background: "linear-gradient(135deg, color.secondary 0%, color.error 50%, color.warning 100%)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxSizing: "border-box"
    };
  };

  // ── Splash auto-advance timer ──
  useEffect(() => {
    if (appFlow === "splash") {
      const t = setTimeout(() => setAppFlow("onboarding"), 2500);
      return () => clearTimeout(t);
    }
  }, [appFlow]);

  // ── Onboarding step data ──
  const onboardingSteps = [
    { icon: <Dumbbell size={36} color={color.primary} />, title: "Personalised Workouts", desc: "AI-powered routines tailored to your body, goals, and recovery." },
    { icon: <Salad size={36} color={color.primary} />, title: "Smart Nutrition", desc: "Scan meals, track macros, and get real-time diet coaching from Rex." },
    { icon: <Brain size={36} color={color.secondary} />, title: "Mind & Recovery", desc: "Yoga, skincare, mood check-ins — your holistic wellness companion." },
    { icon: <Target size={36} color={color.primary} />, title: "Compete & Progress", desc: "Track streaks, climb leaderboards, and unlock achievements daily." },
  ];

  return (
    <div className="main-wrapper">
      <style>{`
        html, body, #root {
          background-color: ${C.appBg};
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          color: ${C.text1};
          transition: background-color 0.3s ease;
          height: 100%;
          width: 100%;
          overflow: hidden;
          position: fixed;
        }

        [data-zone] {
          border-left: 3px solid var(--zone-accent) !important;
        }
        [data-zone="workout"]     { --zone-accent: color.primary; }
        [data-zone="yoga"]        { --zone-accent: color.secondary; }
        [data-zone="skincare"]    { --zone-accent: color.warning; }
        [data-zone="mood"]        { --zone-accent: color.primary; }
        [data-zone="leaderboard"] { --zone-accent: color.text2; }
        [data-zone="supplements"] { --zone-accent: color.secondary; }

        .app-shell {
          background-color: ${C.appBg};
          width: 100%;
          height: 100vh;
          height: 100dvh;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: all 0.3s ease;
        }

        /* Notch & status bar hidden by default on mobile devices */
        .status-notch {
          display: none;
          width: 140px;
          height: 22px;
          background-color: color.error;
          border-bottom-left-radius: 14px;
          border-bottom-right-radius: 14px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 0;
          z-index: 999;
        }

        .status-bar {
          display: none;
          height: 44px;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          font-size: 13px;
          font-weight: 600;
          color: ${C.text1};
          z-index: 10;
        }

        /* Desktop Frame (Only for screen widths wider than mobile devices) */
        @media (min-width: 769px) {
          body {
            background-color: ${C.bg};
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .app-shell {
            max-width: 480px;
            height: 960px;
            border-radius: 40px;
            border: 8px solid color.error;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          }
          .status-notch {
            display: block;
          }
          .status-bar {
            display: flex;
          }
        }

        /* Screen Container */
        .screen-content {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px 84px;
          box-sizing: border-box;
          scrollbar-width: none;
        }

        .screen-content::-webkit-scrollbar {
          display: none;
        }

        /* Cards */
        .card-light {
          background-color: ${C.surface};
          color: ${C.text1};
          border-radius: 20px;
          padding: 16px;
          margin-bottom: 14px;
          box-shadow: ${C.shadow};
          border: 1px solid ${C.border};
          transition: background-color 0.2s, color 0.2s, border-color 0.2s;
        }

        /* Metrics bar in Light Mode */
        .light-metrics-card {
          flex: 1;
          background-color: ${C.surface};
          color: ${C.text1};
          border-radius: 16px;
          padding: 12px 14px;
          display: flex;
          flex-direction: column;
          box-shadow: ${C.shadow};
          border: 1px solid ${C.border};
          position: relative;
          overflow: hidden;
          min-width: 0;
          cursor: pointer;
          transition: background-color 0.2s, color 0.2s, border-color 0.2s;
        }

        .light-metrics-bottom-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

        /* Bottom navigation bar (Floating White Dock) */
        .bottom-nav-bar {
          position: absolute;
          bottom: 12px;
          left: 16px;
          right: 16px;
          height: 64px;
          background-color: ${appTheme === "dark" ? "rgba(28, 28, 36, 0.98)" : "rgba(255, 255, 255, 0.98)"};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid ${C.border};
          border-radius: 36px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 99;
          box-sizing: border-box;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          transition: background-color 0.3s, border-color 0.3s;
        }

        .nav-item {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0;
          transition: transform 0.1s;
        }

        .nav-item:active {
          transform: scale(0.9);
        }

        .success-alert {
          position: absolute;
          top: 52px;
          left: 20px;
          right: 20px;
          background-color: #2E7D32;
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          z-index: 1000;
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          text-align: center;
        }

        /* Form Controls */
        .input-group {
          margin-bottom: 16px;
        }
        
        .input-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: ${C.text2};
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .text-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid ${C.border};
          background-color: ${C.surfaceLight};
          font-size: 14px;
          color: ${C.text1};
          outline: none;
          box-sizing: border-box;
        }

        .btn-action {
          background-color: ${C.accent};
          color: white;
          border: none;
          border-radius: 14px;
          padding: 12px 24px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: ${C.btnShadow};
          width: 100%;
        }

        .btn-action:active {
          transform: scale(0.98);
        }

        /* Expanded Metrics Module Styles */
        .expanded-metric-panel {
          background-color: ${C.surface};
          border-radius: 24px;
          border: 1px solid ${C.border};
          box-shadow: ${C.shadow};
          padding: 20px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          transition: background-color 0.2s, border-color 0.2s;
        }

        .glass-container {
          width: 90px;
          height: 130px;
          border: 3px solid ${C.blue};
          border-bottom-left-radius: 18px;
          border-bottom-right-radius: 18px;
          border-top: none;
          position: relative;
          overflow: hidden;
          margin: 0 auto;
          background-color: rgba(0, 122, 255, 0.03);
          box-shadow: inset 0 -10px 20px rgba(0, 122, 255, 0.05);
        }

        /* Top rim of 3D glass */
        .glass-rim {
          width: 90px;
          height: 12px;
          border: 3px solid ${C.blue};
          border-radius: 50%;
          box-sizing: border-box;
          margin: 0 auto 8px;
          background-color: rgba(255, 255, 255, 0.2);
        }

        .glass-fill {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: ${C.blue};
          transition: height 0.6s cubic-bezier(0.1, 0.8, 0.2, 1);
        }

        .glass-wave {
          position: absolute;
          top: -8px;
          left: -40px;
          width: 180px;
          height: 16px;
          background-image: radial-gradient(circle, transparent 20%, ${C.blue} 21%);
          background-size: 20px 20px;
          animation: wave-motion 1.5s linear infinite;
        }

        @keyframes wave-motion {
          0% { transform: translateX(0); }
          100% { transform: translateX(20px); }
        }

        .sensor-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 6px;
          transition: background-color 0.2s;
        }

        /* Scanner Visual styling */
        .scanner-frame {
          border: 2px dashed ${C.accentOrange};
          border-radius: 16px;
          height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          background-color: ${C.surfaceLight};
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s;
        }

        .scanner-frame:hover {
          border-color: ${C.accent};
        }

        .scanning-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background-color: ${C.accentOrange};
          box-shadow: 0 0 8px ${C.accentOrange};
          animation: scan-up-down 2s linear infinite;
        }

        @keyframes scan-up-down {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {/* ══════ SPLASH SCREEN ══════ */}
        {appFlow === "splash" && (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999,
              background: `linear-gradient(160deg, ${color.bg} 0%, ${color.surface} 40%, ${color.bg} 100%)`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 24, overflow: "hidden"
            }}
          >
            {/* Glowing orb behind logo */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              style={{
                position: "absolute", width: 260, height: 260, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,229,168,0.25) 0%, transparent 70%)",
                pointerEvents: "none"
              }}
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <div style={{ width: 80, height: 80, borderRadius: 24, background: `linear-gradient(135deg, ${color.primary} 0%, ${color.secondary} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 40px rgba(0,229,168,0.4)" }}>
                <Zap size={36} color={color.text1} />
              </div>
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ fontSize: 32, fontWeight: 900, color: color.text1, margin: 0, letterSpacing: 4 }}
            >
              FITVA
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
              style={{ fontSize: 12, color: color.text2, fontWeight: 600, letterSpacing: 2, margin: 0 }}
            >
              YOUR AI FITNESS COMPANION
            </motion.p>
          </motion.div>
        )}

        {/* ══════ ONBOARDING (4 steps) ══════ */}
        {appFlow === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9998,
              background: `linear-gradient(160deg, ${color.bg} 0%, ${color.surface} 40%, ${color.bg} 100%)`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "60px 32px 48px", boxSizing: "border-box"
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`onboard-${onboardingStep}`}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={SPRING}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 24, flex: 1, justifyContent: "center" }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 250, damping: 15 }}
                  style={{
                    width: 88, height: 88, borderRadius: 28,
                    background: "rgba(0,229,168,0.08)", border: "1.5px solid rgba(0,229,168,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  {onboardingSteps[onboardingStep].icon}
                </motion.div>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: color.text1, margin: 0 }}>
                  {onboardingSteps[onboardingStep].title}
                </h2>
                <p style={{ fontSize: 14, color: color.text2, lineHeight: 1.6, margin: 0, maxWidth: 280 }}>
                  {onboardingSteps[onboardingStep].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
              {onboardingSteps.map((_, idx) => (
                <motion.div
                  key={idx}
                  animate={{ width: idx === onboardingStep ? 24 : 8, backgroundColor: idx === onboardingStep ? color.primary : "rgba(255,255,255,0.2)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ height: 8, borderRadius: 4 }}
                />
              ))}
            </div>

            {/* Action button */}
            <Button
              fullWidth
              onClick={() => {
                if (onboardingStep < onboardingSteps.length - 1) {
                  setOnboardingStep(prev => prev + 1);
                } else {
                  setAppFlow("avatar_creation");
                }
              }}
              style={{ maxWidth: 320, fontSize: 14, padding: "14px 24px", borderRadius: 16 }}
            >
              {onboardingStep < onboardingSteps.length - 1 ? "Next" : "Create Your Avatar"}
            </Button>

            {onboardingStep > 0 && (
              <button
                onClick={() => setOnboardingStep(prev => prev - 1)}
                style={{ background: "none", border: "none", color: color.text2, fontSize: 13, fontWeight: 600, marginTop: 12, cursor: "pointer" }}
              >
                ← Back
              </button>
            )}
          </motion.div>
        )}

        {/* ══════ AVATAR CREATION REVEAL ══════ */}
        {appFlow === "avatar_creation" && (
          <motion.div
            key="avatar-creation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9997,
              background: `linear-gradient(160deg, ${color.bg} 0%, ${color.surface} 40%, ${color.bg} 100%)`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: "60px 32px 48px", boxSizing: "border-box", overflow: "hidden"
            }}
          >
            <AnimatePresence mode="wait">
              {/* Phase 1: Capture */}
              {avatarPhase === "capture" && (
                <motion.div
                  key="capture"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={SPRING}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}
                >
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: color.text1, margin: 0 }}>Create Your Avatar</h2>
                  <p style={{ fontSize: 13, color: color.text2, margin: 0 }}>Capture your likeness to build your 3D fitness companion</p>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setAvatarPhase("processing");
                      setTimeout(() => setAvatarPhase("reveal"), 2500);
                    }}
                    style={{
                      width: 180, height: 180, borderRadius: "50%", cursor: "pointer",
                      border: "3px dashed rgba(0,229,168,0.4)", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: 12,
                      background: "rgba(0,229,168,0.04)"
                    }}
                  >
                    <Scan size={40} color={color.primary} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: color.primary }}>TAP TO CAPTURE</span>
                  </motion.div>
                  <button
                    onClick={() => setAppFlow("app")}
                    style={{ background: "none", border: "none", color: color.text2, fontSize: 12, fontWeight: 600, marginTop: 8, cursor: "pointer" }}
                  >
                    Skip for now
                  </button>
                </motion.div>
              )}

              {/* Phase 2: Processing */}
              {avatarPhase === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    style={{
                      width: 64, height: 64, borderRadius: "50%",
                      border: "4px solid rgba(0,229,168,0.15)",
                      borderTop: "4px solid color.primary"
                    }}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    style={{
                      position: "absolute", width: 200, height: 200, borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(91,140,255,0.2) 0%, transparent 70%)",
                      pointerEvents: "none"
                    }}
                  />
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: color.text1, margin: 0 }}>Scanning & Processing…</h3>
                  <p style={{ fontSize: 12, color: color.text2, margin: 0 }}>Building your 3D avatar companion</p>
                </motion.div>
              )}

              {/* Phase 3: Reveal with confetti/glow */}
              {avatarPhase === "reveal" && (
                <motion.div
                  key="reveal"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, textAlign: "center", position: "relative" }}
                >
                  {/* Confetti particles */}
                  {Array.from({ length: 24 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        opacity: 1, scale: 1,
                        x: 0, y: 0
                      }}
                      animate={{
                        opacity: 0,
                        x: (Math.random() - 0.5) * 300,
                        y: (Math.random() - 0.5) * 400,
                        scale: 0,
                        rotate: Math.random() * 720
                      }}
                      transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.3 }}
                      style={{
                        position: "absolute",
                        width: 8 + Math.random() * 8,
                        height: 8 + Math.random() * 8,
                        borderRadius: Math.random() > 0.5 ? "50%" : 2,
                        backgroundColor: [color.primary, color.secondary, color.warning, color.error, color.text1][Math.floor(Math.random() * 5)],
                        pointerEvents: "none", zIndex: 0
                      }}
                    />
                  ))}

                  {/* Glow ring */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                      position: "absolute", width: 220, height: 220, borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(0,229,168,0.25) 0%, transparent 65%)",
                      pointerEvents: "none"
                    }}
                  />

                  <div style={{
                    width: 120, height: 120, borderRadius: "50%", overflow: "hidden",
                    border: "3px solid color.primary", boxShadow: "0 0 40px rgba(0,229,168,0.4)",
                    zIndex: 1
                  }}>
                    <img src="/record_header.png" alt="Your Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>

                  <h2 style={{ fontSize: 22, fontWeight: 900, color: color.text1, margin: 0, zIndex: 1 }}>Avatar Created!</h2>
                  <p style={{ fontSize: 13, color: color.text2, margin: 0, zIndex: 1 }}>Your AI fitness companion is ready</p>

                  <div style={{ display: "flex", gap: 16, marginTop: 8, zIndex: 1 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: color.primary }}>Level 1</div>
                      <div style={{ fontSize: 9, color: color.text2, marginTop: 2 }}>Rank</div>
                    </div>
                    <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: color.secondary }}>0 XP</div>
                      <div style={{ fontSize: 9, color: color.text2, marginTop: 2 }}>Experience</div>
                    </div>
                    <div style={{ width: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 18, fontWeight: 900, color: color.warning }}>12</div>
                      <div style={{ fontSize: 9, color: color.text2, marginTop: 2 }}>Day Streak</div>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    onClick={() => setAppFlow("app")}
                    style={{ maxWidth: 280, marginTop: 16, fontSize: 14, padding: "14px 24px", borderRadius: 16, zIndex: 1 }}
                  >
                    Enter FITVA →
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════ MAIN APP (only rendered when appFlow === "app") ══════ */}
      {appFlow === "app" && (
      <div className="app-shell">
        {/* Apple Notch & Status Bar */}
        <div className="status-notch"></div>
        <div className="status-bar">
          <div>9:41</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Global Action Alert */}
        {alertMsg && <div className="success-alert">{alertMsg}</div>}

        {/* ═══════════════════════════════════════════════════════════
           MAIN SCREEN ROUTING
           ═══════════════════════════════════════════════════════════ */}
        <div className="screen-content">
          <AnimatePresence mode="wait">
            
            {/* 1. HOME TAB */}
            {tab === "home" && !activeOverlay && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={SPRING}
              >
                {/* Header Section */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${C.accent}` }}>
                      <img src="/record_header.png" alt="Arjun" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.text2, textTransform: "uppercase" }}>Hello, Arjun</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: C.text1 }}>FITVA</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: C.surface }}>
                      <Share2 size={18} color={C.text1} />
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backgroundColor: C.surface, position: "relative" }} onClick={() => triggerAlert("No new notifications today!")}>
                      <Bell size={18} color={C.text1} />
                      <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: "50%", backgroundColor: C.accentPink }}></div>
                    </div>
                  </div>
                </div>

                {/* Rebalanced Welcome Section & Current Streak */}
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 16, marginBottom: 20 }}>
                  <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 500, color: C.text2 }}>Good Morning,</div>
                    <div style={{ fontSize: 38, fontWeight: 900, color: C.text1, margin: "2px 0 6px" }}>{user.name}</div>
                    <div style={{ fontSize: 13, color: C.text2, lineHeight: 1.4 }}>
                      Let's build the strongest version of you. 🎯
                    </div>
                  </div>

                  {/* Current Streak Card */}
                  <div className="card-light" style={{ padding: 14, margin: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", height: 160 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 700, color: C.text2, textTransform: "uppercase" }}>Current Streak</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: C.text1, marginTop: 2 }}>{user.streak} Days</div>
                      </div>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", backgroundColor: "rgba(255, 95, 31, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Flame size={18} color={C.accentOrange} fill={C.accentOrange} />
                      </div>
                    </div>
                    {/* Weekday indicators */}
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0" }}>
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: C.text2 }}>{day}</span>
                          <div style={{
                            width: 14, height: 14, borderRadius: "50%",
                            backgroundColor: i < 5 ? (appTheme === "dark" ? "#1A3A27" : "#E8F5E9") : "transparent",
                            border: i < 5 ? "none" : `1px solid ${C.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            {i < 5 && <Check size={10} strokeWidth={3} color={appTheme === "dark" ? color.primary : color.primary} />}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>
                      <span style={{ fontSize: 10, color: C.text2 }}>Keep going! You're doing great.</span>
                      <TrendingUp size={12} color={color.secondary} />
                    </div>
                  </div>
                </div>

                {/* 3 Metrics Cards (Exactly matching Water, Nutrition, Mind from image.png) */}
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  {/* Water Card Trigger (Controlled by clicking it to expand/toggle) */}
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className="light-metrics-card" 
                    onClick={() => {
                      if (isMetricsExpanded && metricsMode === "water") {
                        setIsMetricsExpanded(false);
                      } else {
                        setIsMetricsExpanded(true);
                        setMetricsMode("water");
                      }
                    }}
                    style={{ border: isMetricsExpanded && metricsMode === "water" ? `2.5px solid ${C.blue}` : `1px solid ${C.border}` }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(0,122,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Droplet size={14} color={color.secondary} fill={color.secondary} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.text2 }}>Water</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{user.waterToday}L <span style={{ fontSize: 10, color: C.text2, fontWeight: 500 }}>/ {user.waterGoal}L</span></div>
                    <div className="light-metrics-bottom-bar" style={{ backgroundColor: color.secondary }}></div>
                  </motion.div>

                  {/* Steps Card Trigger (Accesses Steps section and toggles) */}
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className="light-metrics-card" 
                    onClick={() => {
                      if (isMetricsExpanded && metricsMode === "steps") {
                        setIsMetricsExpanded(false);
                      } else {
                        setIsMetricsExpanded(true);
                        setMetricsMode("steps");
                      }
                    }}
                    style={{ border: isMetricsExpanded && metricsMode === "steps" ? `2.5px solid ${C.accent}` : `1px solid ${C.border}` }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(0,168,107,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Footprints size={14} color={C.accent} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.text2 }}>Steps</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{user.stepsToday.toLocaleString()} <span style={{ fontSize: 10, color: C.text2, fontWeight: 500 }}>steps</span></div>
                    <div className="light-metrics-bottom-bar" style={{ backgroundColor: C.accent }}></div>
                  </motion.div>

                  {/* Mind */}
                  <div className="light-metrics-card" onClick={() => triggerAlert("Track Mind/Mood using the '+' button!")}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(255,45,85,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Heart size={14} color={C.accentPink} fill={C.accentPink} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.text2 }}>Mind</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{user.mindToday} <span style={{ fontSize: 10, color: C.text2, fontWeight: 500 }}>/ {user.mindGoal}</span></div>
                    <div className="light-metrics-bottom-bar" style={{ backgroundColor: C.accentPink }}></div>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════════
                   EXPANDABLE MODULE (STRICT LEFT-TO-RIGHT SLIDE)
                   ═══════════════════════════════════════════════════════ */}
                <AnimatePresence>
                  {isMetricsExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="expanded-metric-panel"
                    >
                      {/* Segmented Mode Controller Toggle */}
                      <div style={{ display: "flex", marginBottom: 20, backgroundColor: C.surfaceLight, borderRadius: 14, padding: 4, border: `1px solid ${C.border}` }}>
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setMetricsMode("water")}
                          style={{
                            flex: 1, padding: "10px 12px", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700,
                            backgroundColor: metricsMode === "water" ? C.surface : "transparent",
                            color: metricsMode === "water" ? C.blue : C.text2,
                            cursor: "pointer", transition: "all 0.2s"
                          }}
                        >
                          💧 Water
                        </motion.button>
                        <motion.button 
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setMetricsMode("steps")}
                          style={{
                            flex: 1, padding: "10px 12px", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700,
                            backgroundColor: metricsMode === "steps" ? C.surface : "transparent",
                            color: metricsMode === "steps" ? C.accent : C.text2,
                            cursor: "pointer", transition: "all 0.2s"
                          }}
                        >
                          🏃 Steps
                        </motion.button>
                      </div>

                      {/* Content panel with strictly left-to-right sliding transition */}
                      <div style={{ position: "relative", minHeight: 225, overflow: "hidden" }}>
                        <AnimatePresence>
                          
                          {/* WATER DETAILS VIEW */}
                          {metricsMode === "water" && (
                            <motion.div
                              key="water-expanded"
                              initial={{ x: "-100%", opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: "100%", opacity: 0 }}
                              transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
                              style={{ position: "absolute", width: "100%" }}
                            >
                              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, alignItems: "center" }}>
                                {/* Left Side Details */}
                                <div>
                                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text1, lineHeight: 1.3 }}>
                                    Good evening Arjun,
                                  </div>
                                  <div style={{ fontSize: 13, color: C.blue, fontWeight: 700, marginTop: 4, textTransform: "capitalize" }}>
                                    {getWaterMotivation()}
                                  </div>

                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 24, marginBottom: 14 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>Target</span>
                                    <input 
                                      type="number" 
                                      value={waterGoalInput}
                                      step="0.1"
                                      onChange={(e) => {
                                        setWaterGoalInput(e.target.value);
                                        const val = parseFloat(e.target.value);
                                        if (val > 0) setUser(prev => ({ ...prev, waterGoal: val }));
                                      }}
                                      style={{
                                        width: 70, padding: "8px 12px", border: `1px solid ${C.border}`,
                                        borderRadius: 10, outline: "none", fontSize: 13, fontWeight: 700,
                                        backgroundColor: C.surfaceLight, textAlign: "center"
                                      }}
                                    />
                                    <span style={{ fontSize: 12, fontWeight: 700 }}>L</span>
                                  </div>

                                  <motion.button 
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      setUser(prev => ({ ...prev, waterToday: parseFloat((prev.waterToday + 0.2).toFixed(1)) }));
                                      triggerAlert("Drank 200ml of water! 💧");
                                    }}
                                    style={{
                                      backgroundColor: C.blue, color: "white", border: "none", borderRadius: 12,
                                      padding: "12px 24px", fontWeight: 700, fontSize: 13, cursor: "pointer",
                                      boxShadow: "0 6px 12px rgba(0, 122, 255, 0.2)"
                                    }}
                                  >
                                    Achieve
                                  </motion.button>
                                </div>

                                {/* Right Side: Glass Visual */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <div className="glass-rim"></div>
                                  <div className="glass-container">
                                    <div className="glass-fill" style={{ height: `${Math.min((user.waterToday / user.waterGoal) * 100, 100)}%` }}>
                                      <div className="glass-wave"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* STEPS DETAILS VIEW */}
                          {metricsMode === "steps" && (
                            <motion.div
                              key="steps-expanded"
                              initial={{ x: "-100%", opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              exit={{ x: "100%", opacity: 0 }}
                              transition={{ type: "tween", ease: "easeInOut", duration: 0.35 }}
                              style={{ position: "absolute", width: "100%" }}
                              onMouseMove={handleMouseMove}
                            >
                              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 16, alignItems: "center" }}>
                                {/* Left Side Details */}
                                <div>
                                  <div style={{ fontSize: 16, fontWeight: 800, color: C.text1 }}>
                                    Good evening Arjun
                                  </div>
                                  <div style={{ fontSize: 11, color: C.text2, marginTop: 4, lineHeight: 1.4 }}>
                                    Desktop check: move cursor over this card to walk.
                                  </div>

                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20, marginBottom: 14 }}>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text2 }}>Goal</span>
                                    <input 
                                      type="number" 
                                      value={stepsGoalInput}
                                      onChange={(e) => {
                                        setStepsGoalInput(e.target.value);
                                        const val = parseInt(e.target.value);
                                        if (val > 0) setUser(prev => ({ ...prev, stepsGoalInput: val }));
                                      }}
                                      style={{
                                        width: 80, padding: "8px 12px", border: `1px solid ${C.border}`,
                                        borderRadius: 10, outline: "none", fontSize: 13, fontWeight: 700,
                                        backgroundColor: C.surfaceLight, textAlign: "center", color: C.text1
                                      }}
                                    />
                                  </div>

                                  <motion.button 
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      setSensorActive(!sensorActive);
                                      triggerAlert(sensorActive ? "Steps sensor paused!" : "Steps sensor active! Shake device or swipe mouse to walk.");
                                    }}
                                    style={{
                                      backgroundColor: sensorActive ? C.text2 : C.accent, color: "white", border: "none", borderRadius: 12,
                                      padding: "12px 24px", fontWeight: 700, fontSize: 13, cursor: "pointer",
                                      boxShadow: sensorActive ? "none" : C.btnShadow
                                    }}
                                  >
                                    {sensorActive ? "Pause" : "Achieve"}
                                  </motion.button>
                                </div>

                                {/* Right Side: Walking Visual Footprints */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <div style={{ fontSize: 20, fontWeight: 800, color: C.text1 }}>
                                    {user.stepsToday.toLocaleString()}
                                  </div>
                                  <div style={{ fontSize: 10, color: C.text2, marginTop: 2, marginBottom: 12 }}>steps</div>

                                  <div style={{ display: "flex", gap: 10 }}>
                                    <motion.div 
                                      animate={sensorActive ? { y: [0, -8, 0], scale: [1, 1.05, 1] } : {}}
                                      transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                                      style={{ fontSize: 32, opacity: sensorActive ? 1 : 0.2 }}
                                    >
                                      🦶
                                    </motion.div>
                                    <motion.div 
                                      animate={sensorActive ? { y: [0, -8, 0], scale: [1, 1.05, 1] } : {}}
                                      transition={{ repeat: Infinity, duration: 0.8, delay: 0.4, ease: "easeInOut" }}
                                      style={{ fontSize: 32, opacity: sensorActive ? 1 : 0.2 }}
                                    >
                                      👣
                                    </motion.div>
                                  </div>

                                  <div style={{ display: "flex", alignItems: "center", fontSize: 10, fontWeight: 700, color: sensorActive ? C.accent : C.text2, marginTop: 12 }}>
                                    <span className="sensor-indicator" style={{ backgroundColor: sensorActive ? C.accent : C.text2 }}></span>
                                    {sensorActive ? "ACTIVE" : "INACTIVE"}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sparkling tagline Banner */}
                <div className="card-light" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 14, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "rgba(0,168,107,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles size={16} color={C.accent} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Discipline today, strength tomorrow.</div>
                      <div style={{ fontSize: 11, color: C.text2, marginTop: 2 }}>Your future self is counting on you.</div>
                    </div>
                  </div>
                  <ArrowRight size={16} color={C.text2} style={{ cursor: "pointer" }} />
                </div>

                {/* 4 Action Cards Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Workout", icon: <Dumbbell size={16} />, tone: "primary", action: () => setTab("plan") },
                    { label: "Nutrition", icon: <ChefHat size={16} />, tone: "secondary", action: () => setActiveOverlay("nutrition") },
                    { label: "Progress", icon: <TrendingUp size={16} />, tone: "secondary", action: () => setActiveOverlay("progress") },
                    { label: "Rex AI Coach", icon: <Sparkles size={16} />, tone: "secondary", action: () => setActiveOverlay("rex_coach") },
                  ].map((act, i) => (
                    <Card
                      key={act.label}
                      index={i}
                      onClick={act.action}
                      padding="10px"
                      style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
                    >
                      <IconBadge icon={act.icon} tone={act.tone} size={32} />
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.text1, marginTop: "6px" }}>{act.label}</div>
                    </Card>
                  ))}
                </div>

                {/* Train Today Section */}
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text1, marginBottom: 12 }}>Train Today</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 12, marginBottom: 20 }}>
                  {/* Workout Progress Card */}
                  <Card style={{ margin: 0, padding: 14, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <IconBadge icon={<Activity size={16} />} tone="primary" size={32} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>Workout</div>
                          <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>Legs + Core &bull; 45m &bull; High</div>
                        </div>
                      </div>
                      <Button 
                        variant="secondary"
                        onClick={() => setActiveOverlay("active_workout")}
                        style={{ padding: "6px 10px", fontSize: 9, borderRadius: 12 }}
                      >
                        TODAY'S PLAN &gt;
                      </Button>
                    </div>

                    <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
                      <ProgressRing value={(user.setsCompleted / user.setsTotal) * 100} size={48} strokeWidth={4} label={`${user.setsCompleted}/${user.setsTotal}`} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.text1 }}>{user.setsCompleted} of {user.setsTotal} sets</div>
                        <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Workout progress</div>
                      </div>
                    </div>
                  </Card>

                  {/* Side Recovery Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Yoga */}
                    <Card onClick={() => setActiveOverlay("yoga")} padding="10px" style={{ margin: 0, flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                      <IconBadge icon={<Plus size={12} />} tone="secondary" size={24} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.text1 }}>Yoga</div>
                        <div style={{ fontSize: 8, color: color.secondary, fontWeight: 700, marginTop: 2 }}>RECOVERY</div>
                      </div>
                    </Card>

                    {/* Skincare */}
                    <Card onClick={() => setActiveOverlay("skincare")} padding="10px" style={{ margin: 0, flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                      <IconBadge icon={<Sparkles size={12} />} tone="error" size={24} />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.text1 }}>Skincare</div>
                        <div style={{ fontSize: 8, color: color.error, fontWeight: 700, marginTop: 2 }}>EVENING</div>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Today's Habits */}
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text1, marginBottom: 12 }}>Today's Habits</h3>
                <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {[
                    { label: "Water", val: `${user.waterToday}L`, bar: color.secondary, prg: (user.waterToday / user.waterGoal) * 100 },
                    { label: "Kcal", val: `${user.calToday.toLocaleString()}`, bar: color.warning, prg: (user.calToday / user.calGoal) * 100 },
                    { label: "Mood", val: user.moodToday, bar: color.secondary, prg: user.moodToday === "Good" ? 80 : 50 }
                  ].map((hab, idx) => (
                    <motion.div key={idx} variants={staggerItem}>
                      <Card padding="12px" style={{ margin: 0, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <ProgressRing value={hab.prg} color={hab.bar} size={44} strokeWidth={4} showLabel={false}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: hab.bar }}>{hab.val}</span>
                        </ProgressRing>
                        <div style={{ fontSize: 9, color: C.text2, marginTop: 6, fontWeight: 600 }}>{hab.label}</div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Community & Health section lists */}
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text1, marginBottom: 12 }}>Community & Health</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <Card onClick={() => setTab("community")} padding="12px 14px" style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <IconBadge icon={<Trophy size={14} />} tone="primary" size={28} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Leaderboard</span>
                    </div>
                    <span style={{ fontSize: 10, color: color.primary, fontWeight: 700 }}>RANK #24</span>
                  </Card>

                  <Card onClick={() => setActiveOverlay("supplements")} padding="12px 14px" style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <IconBadge icon={<ShoppingBag size={14} />} tone="warning" size={28} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Supplements</span>
                    </div>
                    <span style={{ fontSize: 10, color: color.warning, fontWeight: 700 }}>STOCKED</span>
                  </Card>
                </div>
              </motion.div>
            )}

            {/* 2. PLAN TAB */}
            {tab === "plan" && !activeOverlay && (
              <motion.div
                key="plan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={SPRING}
                style={{ height: "100%" }}
              >
                <div style={{ 
                  backgroundColor: C.appBg, 
                  minHeight: "100%", 
                  color: C.text1, 
                  padding: "16px 20px 84px", 
                  margin: "-16px -20px -84px", 
                  boxSizing: "border-box",
                  transition: "background-color 0.3s, color 0.3s"
                }}>
                  {/* Header Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img src="/record_header.png" style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid color.primary" }} alt="avatar" />
                      <div>
                        <div style={{ fontSize: 16, fontWeight: "900", letterSpacing: "-0.5px", textTransform: "uppercase", color: C.text1 }}>HI JAMES</div>
                        <div style={{ fontSize: 10, color: C.text2, display: "flex", alignItems: "center", gap: 4 }}>
                          <span>⚡</span> Fitness Freak
                        </div>
                      </div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: C.surfaceLight, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", position: "relative" }} onClick={() => triggerAlert("No new notifications!")}>
                      <Bell size={18} color={C.text1} />
                      <div style={{ position: "absolute", top: 12, right: 12, width: 6, height: 6, borderRadius: "50%", backgroundColor: C.accentPink }}></div>
                    </div>
                  </div>

                  {/* Neon Lime Progress Card */}
                  <div style={{
                    background: "linear-gradient(135deg, color.primary 0%, color.primary 100%)",
                    borderRadius: 24,
                    padding: 20,
                    marginBottom: 24,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                    color: "#0F260C"
                  }}>
                    {/* Background rings */}
                    <div style={{ position: "absolute", right: -20, top: -20, width: 140, height: 140, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.04)" }}></div>
                    <div style={{ position: "absolute", right: -40, top: -40, width: 180, height: 180, borderRadius: "50%", border: "1.5px solid rgba(0,0,0,0.04)" }}></div>

                    <div style={{ zIndex: 2 }}>
                      <div style={{ fontSize: 11, fontWeight: "800", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Progress</div>
                      <h2 style={{ fontSize: 24, fontWeight: "900", margin: "4px 0", letterSpacing: "-0.5px" }}>Lower Body</h2>
                      <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 16 }}>Cardio &bull; 10 mins</div>
                      <button 
                        onClick={() => triggerAlert("Lower Body workout stats logged!")}
                        style={{
                          backgroundColor: color.bg, color: color.text1, padding: "8px 16px", borderRadius: 20,
                          fontSize: 11, fontWeight: "900", display: "flex", alignItems: "center", gap: 6, border: "none", cursor: "pointer"
                        }}
                      >
                        538 CALORIES
                        <span style={{ fontSize: 10 }}>↗</span>
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 2, position: "relative" }}>
                      {/* Circular Progress Ring */}
                      <div style={{
                        position: "absolute", top: -14, right: -4, width: 38, height: 38, borderRadius: "50%",
                        border: "3px solid color.bg", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: "900"
                      }}>
                        72%
                      </div>
                      <img src="/body_builder_trainer.png" alt="Trainer" style={{ width: 100, height: 115, objectFit: "contain", marginTop: 24 }} />
                    </div>
                  </div>

                  {/* Your Plan Header */}
                  <h3 style={{ fontSize: 18, fontWeight: "900", color: C.text1, marginBottom: 14, letterSpacing: "-0.5px" }}>Your plan</h3>

                  {/* Horizontal Category Tabs */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", scrollbarWidth: "none" }}>
                    <button style={{
                      backgroundColor: C.text1, color: C.appBg, padding: "8px 16px", borderRadius: 20,
                      fontSize: 12, fontWeight: "800", border: "none", cursor: "pointer", whiteSpace: "nowrap"
                    }}>
                      All workouts
                    </button>
                    <button 
                      onClick={() => triggerAlert("Filter set to Lower Body")}
                      style={{
                        backgroundColor: C.surfaceLight, color: C.text2, padding: "8px 16px", borderRadius: 20,
                        fontSize: 12, fontWeight: "700", border: "none", cursor: "pointer", whiteSpace: "nowrap"
                      }}
                    >
                      Lower body
                    </button>
                    <button 
                      onClick={() => triggerAlert("Filter set to Upper Body")}
                      style={{
                        backgroundColor: C.surfaceLight, color: C.text2, padding: "8px 16px", borderRadius: 20,
                        fontSize: 12, fontWeight: "700", border: "none", cursor: "pointer", whiteSpace: "nowrap"
                      }}
                    >
                      Upper body
                    </button>
                  </div>

                  {/* Asymmetrical Cards List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Card 1: Lower Body Workout */}
                    <div 
                      onClick={() => setActiveOverlay("active_workout")}
                      style={{
                        backgroundColor: color.secondary,
                        borderRadius: 24,
                        padding: "20px 16px 16px",
                        position: "relative",
                        overflow: "hidden",
                        color: "#0F0F26",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: 180,
                        boxShadow: "0 10px 20px rgba(181, 181, 248, 0.15)"
                      }}
                    >
                      {/* Top-right Cutout Badge */}
                      <div style={{
                        position: "absolute", top: 0, right: 0, width: 75, height: 75,
                        backgroundColor: C.appBg, borderBottomLeftRadius: 36,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 3,
                        transition: "background-color 0.3s"
                      }}>
                        <span style={{ fontSize: 16, fontWeight: "900", lineHeight: 1, color: C.text1 }}>30</span>
                        <span style={{ fontSize: 9, fontWeight: "700", opacity: 0.8, color: C.text1 }}>mins</span>
                      </div>

                      <div style={{ zIndex: 2, width: "65%" }}>
                        <h4 style={{ fontSize: 20, fontWeight: "900", margin: 0, letterSpacing: "-0.5px" }}>Lower body workout</h4>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 2 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ backgroundColor: C.text1, color: C.appBg, padding: "4px 10px", borderRadius: 12, fontSize: 9, fontWeight: "800", transition: "background-color 0.3s, color 0.3s" }}>Cardio</span>
                            <span style={{ fontSize: 11, fontWeight: "800", opacity: 0.8 }}>5 exercises</span>
                          </div>
                          <div style={{ fontSize: 11, fontWeight: "700", opacity: 0.9 }}>Glutes / Squats / Hamstrings</div>
                        </div>
                        <img src="/total_attack.png" alt="Lower Body Workout" style={{ width: 110, height: 110, objectFit: "contain", marginRight: -10, marginBottom: -10 }} />
                      </div>
                    </div>

                    {/* Card 2: Upper Body Workout */}
                    <div 
                      onClick={() => triggerAlert("Upper body workout starts in Pro upgrade!")}
                      style={{
                        backgroundColor: "#FBC8D4",
                        borderRadius: 24,
                        padding: "20px 16px 16px",
                        position: "relative",
                        overflow: "hidden",
                        color: "#2E0F1F",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: 180,
                        boxShadow: "0 10px 20px rgba(251, 200, 212, 0.15)"
                      }}
                    >
                      {/* Top-right Cutout Badge */}
                      <div style={{
                        position: "absolute", top: 0, right: 0, width: 75, height: 75,
                        backgroundColor: C.appBg, borderBottomLeftRadius: 36,
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 3,
                        transition: "background-color 0.3s"
                      }}>
                        <span style={{ fontSize: 16, fontWeight: "900", lineHeight: 1, color: C.text1 }}>20</span>
                        <span style={{ fontSize: 9, fontWeight: "700", opacity: 0.8, color: C.text1 }}>mins</span>
                      </div>

                      <div style={{ zIndex: 2, width: "65%" }}>
                        <h4 style={{ fontSize: 20, fontWeight: "900", margin: 0, letterSpacing: "-0.5px" }}>Upper body workout</h4>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 2 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <span style={{ backgroundColor: C.text1, color: C.appBg, padding: "4px 10px", borderRadius: 12, fontSize: 9, fontWeight: "800", transition: "background-color 0.3s, color 0.3s" }}>Strength</span>
                            <span style={{ fontSize: 11, fontWeight: "800", opacity: 0.8 }}>6 exercises</span>
                          </div>
                          <div style={{ fontSize: 11, fontWeight: "700", opacity: 0.9 }}>Chest / Shoulders / Triceps</div>
                        </div>
                        <img src="/chest_workout.png" alt="Upper Body Workout" style={{ width: 110, height: 110, objectFit: "contain", marginRight: -10, marginBottom: -10 }} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. COMMUNITY TAB */}
            {tab === "community" && !activeOverlay && (
              <motion.div
                key="community"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={SPRING}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h1 className="header-title" style={{ color: C.text1, margin: 0 }}>Community</h1>
                  <button 
                    onClick={() => triggerAlert("Share a post in next update!")}
                    style={{ background: "none", border: "none", color: C.accent, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                  >
                    + Share
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {posts.map((post) => (
                    <div className="card-light" key={post.id} style={{ padding: 16, margin: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: C.surfaceLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, border: `1px solid ${C.border}`, color: C.text1 }}>
                          {post.user.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>{post.user}</div>
                          <div style={{ fontSize: 10, color: C.text2 }}>{post.time}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: C.text1, margin: "0 0 12px", lineHeight: 1.5 }}>
                        {post.caption}
                      </p>
                      <div style={{ display: "flex", gap: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                        <button 
                          onClick={() => {
                            const updated = posts.map(p => p.id === post.id ? { ...p, boosts: p.boosts + 1 } : p);
                            setPosts(updated);
                            triggerAlert(`Boosted ${post.user}'s post! ⚡`);
                          }}
                          style={{
                            flex: 1, padding: "8px 12px", borderRadius: 10, border: "none",
                            backgroundColor: "rgba(0, 168, 107, 0.08)", color: C.accent,
                            fontWeight: 700, fontSize: 11, cursor: "pointer"
                          }}
                        >
                          ⚡ BOOST ({post.boosts})
                        </button>
                        <button 
                          onClick={() => triggerAlert("Challenge accepted!")}
                          style={{
                            flex: 1, padding: "8px 12px", borderRadius: 10, border: `1px solid ${C.border}`,
                            backgroundColor: "transparent", color: C.text2,
                            fontWeight: 600, fontSize: 11, cursor: "pointer"
                          }}
                        >
                          🎯 ACCEPT CHALLENGE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 4. PROFILE TAB */}
            {tab === "profile" && !activeOverlay && (() => {
              const isDark = appTheme === "dark";
              return (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={SPRING}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <h1 className="header-title" style={{ margin: 0 }}>My Profile</h1>
                    <Edit3 size={20} style={{ cursor: "pointer", color: C.text2 }} onClick={() => triggerAlert("Editing profile is locked in beta.")} />
                  </div>

                  {/* Pro Theme Toggle Switcher */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: "800", color: C.text2, letterSpacing: "0.5px" }}>PROFILE THEME</span>
                    <div style={{ display: "flex", gap: 4, backgroundColor: C.surfaceLight, borderRadius: 12, padding: 3, border: `1px solid ${C.border}` }}>
                      <button 
                        onClick={() => setAppTheme("light")}
                        style={{
                          padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 11, fontWeight: "800",
                          backgroundColor: !isDark ? C.surface : "transparent",
                          color: !isDark ? C.accent : color.text2,
                          cursor: "pointer", boxShadow: !isDark ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
                          transition: "all 0.2s"
                        }}
                      >
                        Light
                      </button>
                      <button 
                        onClick={() => setAppTheme("dark")}
                        style={{
                          padding: "6px 12px", border: "none", borderRadius: 8, fontSize: 11, fontWeight: "800",
                          backgroundColor: isDark ? (isDark ? color.bg : C.surface) : "transparent",
                          color: isDark ? color.primary : C.text2,
                          cursor: "pointer", boxShadow: isDark ? "0 2px 4px rgba(0,0,0,0.15)" : "none",
                          transition: "all 0.2s"
                        }}
                      >
                        Dark
                      </button>
                    </div>
                  </div>

                  {/* User profile card */}
                  <div className="card-light" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: `2.5px solid ${C.accent}`, flexShrink: 0 }}>
                      <img src="/record_header.png" alt="Arjun Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text1, margin: 0 }}>{user.name}</h2>
                      <p style={{ fontSize: 12, color: C.text2, margin: "2px 0 0" }}>arjun@fitva.com</p>
                      <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: isDark ? "#1E3A27" : "#E8F5E9", color: isDark ? color.primary : color.primary, padding: "2px 6px", borderRadius: 6 }}>LEVEL 4</span>
                        <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: isDark ? color.warning : "rgba(255, 95, 31, 0.1)", color: isDark ? color.warning : C.accentOrange, padding: "2px 6px", borderRadius: 6 }}>1,240 XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Stats */}
                  <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                    <div className="card-light" style={{ flex: 1, textAlign: "center", margin: 0, padding: 12 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.accentOrange }}>{user.streak} Days</div>
                      <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>Streak</div>
                    </div>
                    <div className="card-light" style={{ flex: 1, textAlign: "center", margin: 0, padding: 12 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: color.secondary }}>24th</div>
                      <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>Leaderboard</div>
                    </div>
                    <div className="card-light" style={{ flex: 1, textAlign: "center", margin: 0, padding: 12 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: color.secondary }}>{user.workoutCompleted}</div>
                      <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>Workouts</div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="card-light">
                    <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text1, margin: "0 0 12px" }}>Personal Details</h3>
                    {[
                      { label: "Goal", value: user.goal },
                      { label: "Height", value: `${user.height} cm` },
                      { label: "Weight", value: `${user.weight} kg` },
                      { label: "Age", value: `${user.age} yrs` }
                    ].map((detail, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: idx < 3 ? `1px solid ${C.border}` : "none" }}>
                        <span style={{ fontSize: 13, color: C.text2 }}>{detail.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })()}

          </AnimatePresence>

          {/* ═══════════════════════════════════════════════════════════
             OVERLAYS & MODALS
             ═══════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            


            {/* B. ACTIVE WORKOUT SESSION PLAYER */}
            {activeOverlay === "active_workout" && (
              <motion.div
                key="workout-player"
                initial={{ opacity: 0, y: 960 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 960 }}
                transition={{ type: "spring", damping: 30 }}
                style={{
                  position: "absolute", inset: 0, backgroundColor: color.bg, zIndex: 1000,
                  display: "flex", flexDirection: "column", boxSizing: "border-box",
                  overflow: "hidden"
                }}
              >
                {/* Cinematic Hero Image Background */}
                <div style={{
                  position: "absolute", inset: 0,
                  backgroundImage: "url('/body_builder_trainer.png')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: 1
                }} />
                
                {/* Gradient Overlay for Legibility */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
                  zIndex: 2
                }} />

                {/* Top Controls HUD */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "60px 24px 20px", zIndex: 3, width: "100%" }}>
                  <div style={{ color: color.text1 }}>
                    <button 
                      style={{ background: "none", border: "none", color: color.text1, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}
                      onClick={() => setActiveOverlay(null)}
                    >
                      <ArrowLeft size={20} /> Back
                    </button>
                    <h1 style={{ fontSize: 24, fontWeight: "900", margin: 0, letterSpacing: "-0.5px" }}>Your Workout</h1>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14 }}>
                    {/* Pause Button */}
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setIsWorkoutPaused(!isWorkoutPaused);
                        triggerAlert(isWorkoutPaused ? "Workout resumed!" : "Workout paused!");
                      }}
                      style={{
                        width: 46, height: 46, borderRadius: "50%", backgroundColor: color.text1,
                        display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.15)"
                      }}
                    >
                      {isWorkoutPaused ? <Play size={18} fill={color.bg} color={color.bg} style={{ marginLeft: 2 }} /> : <X size={18} color={color.bg} strokeWidth={3} />}
                    </motion.button>
                    
                    {/* Calories counter */}
                    <div style={{ textAlign: "right", color: color.text1 }}>
                      <div style={{ fontSize: 18, fontWeight: "900", lineHeight: 1 }}>328</div>
                      <div style={{ fontSize: 9, color: color.text2, fontWeight: "700", textTransform: "uppercase", marginTop: 2 }}>Kcal Burned</div>
                    </div>

                    {/* Vertical Progress Bar Level Indicators */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                      {[1, 2, 3, 4, 5].map((lvl) => {
                        const active = lvl <= 2; // Level 2 active
                        return (
                          <div 
                            key={lvl} 
                            style={{
                              width: 14, height: 5, borderRadius: 2.5,
                              backgroundColor: active ? color.secondary : "rgba(255,255,255,0.2)",
                              boxShadow: active ? "0 0 6px color.secondary" : "none"
                            }} 
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Bottom Timer Dashboard Card */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: 250,
                  backgroundColor: color.text1, borderTopLeftRadius: 40, borderTopRightRadius: 40,
                  zIndex: 3, padding: "24px 20px 20px", display: "flex", flexDirection: "column",
                  justifyContent: "space-between", boxShadow: "0 -10px 30px rgba(0,0,0,0.2)", boxSizing: "border-box"
                }}>
                  {/* Pull Indicator Pill */}
                  <div style={{ width: 40, height: 5, backgroundColor: color.border, borderRadius: 2.5, alignSelf: "center", marginBottom: 14 }}></div>

                  {/* Timer Info Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Elapsed */}
                    <div style={{ width: "25%" }}>
                      <div style={{ fontSize: 10, fontWeight: "800", color: color.text2, textTransform: "uppercase" }}>Elapsed</div>
                      <div style={{ fontSize: 18, fontWeight: "900", color: color.surface, marginTop: 2 }}>
                        {Math.floor(elapsedSeconds / 60).toString().padStart(2, '0')}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
                      </div>
                    </div>

                    {/* Digital timer */}
                    <div style={{ 
                      fontSize: 38, fontWeight: "900", color: color.surface, textAlign: "center", 
                      fontFamily: "Courier, monospace", letterSpacing: "1px" 
                    }}>
                      {Math.floor(workoutTimer / 60).toString().padStart(2, '0')}:{(workoutTimer % 60).toString().padStart(2, '0')}
                    </div>

                    {/* Set */}
                    <div style={{ width: "25%", textAlign: "right" }}>
                      <div style={{ fontSize: 10, fontWeight: "800", color: color.text2, textTransform: "uppercase" }}>Set</div>
                      <div style={{ fontSize: 18, fontWeight: "900", color: color.surface, marginTop: 2 }}>2/5</div>
                    </div>
                  </div>

                  {/* Bottom Navigation Dock inside bottom card */}
                  <div style={{
                    display: "flex", justifyContent: "space-around", alignItems: "center",
                    backgroundColor: "#F2F2F7", borderRadius: 32, padding: "6px 16px", marginTop: 14
                  }}>
                    {[
                      { icon: <HomeIcon size={20} color={color.text2} />, key: "home" },
                      { icon: <TrendingUp size={20} color={color.text2} />, key: "stats" },
                      { icon: <Dumbbell size={20} color={color.text1} />, key: "workout", active: true },
                      { icon: <User size={20} color={color.text2} />, key: "profile" }
                    ].map((nav, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          if (nav.key === "home") { setTab("home"); setActiveOverlay(null); }
                          else if (nav.key === "stats") { setActiveOverlay("progress"); }
                          else if (nav.key === "profile") { setTab("profile"); setActiveOverlay(null); }
                          else { setActiveOverlay(null); }
                        }}
                        style={{
                          width: 44, height: 44, borderRadius: "50%",
                          backgroundColor: nav.active ? color.secondary : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                          transition: "background-color 0.2s"
                        }}
                      >
                        {nav.icon}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* C. QUICK LOG MODAL OVERLAY */}
            <Sheet
              isOpen={activeOverlay === "quick_log"}
              onClose={() => setActiveOverlay(null)}
              title="Quick Log Habits"
            >
              {/* Water Quick Log Preset */}
              <div style={{ marginBottom: 14 }}>
                <label className="input-label" style={{ marginBottom: 8 }}>Water Intake</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["+250ml", "+500ml", "+750ml"].map((ml) => (
                    <Button key={ml} onClick={() => {
                      const val = parseFloat(ml) / 1000;
                      setUser(prev => ({ ...prev, waterToday: parseFloat((prev.waterToday + val).toFixed(1)) }));
                      triggerAlert(`Added ${ml} water intake!`);
                      setCelebration("streak");
                    }} variant="secondary" fullWidth style={{ fontSize: 12, padding: "10px" }}>
                      {ml}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Log Nutrition Preset */}
              <div style={{ marginBottom: 14 }}>
                <label className="input-label" style={{ marginBottom: 8 }}>Log Nutrition</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["+300 Cal", "+500 Cal", "+700 Cal"].map((cal) => (
                    <Button key={cal} onClick={() => {
                      const val = parseInt(cal);
                      setUser(prev => ({ ...prev, calToday: prev.calToday + val }));
                      triggerAlert(`Logged ${cal} meal!`);
                      setCelebration("streak");
                    }} variant="secondary" fullWidth style={{ fontSize: 12, padding: "10px" }}>
                      {cal}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mind/Mood Quick Log */}
              <div style={{ marginBottom: 20 }}>
                <label className="input-label" style={{ marginBottom: 8 }}>Select Mood</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["Good", "Tired", "Energetic"].map((m) => (
                    <Button key={m} onClick={() => {
                      setUser(prev => ({ ...prev, moodToday: m, mindToday: m === "Good" ? 8 : m === "Energetic" ? 10 : 5 }));
                      triggerAlert(`Mood logged as ${m}!`);
                      setCelebration("streak");
                    }} variant={user.moodToday === m ? "primary" : "secondary"} fullWidth style={{ fontSize: 12, padding: "10px" }}>
                      {m}
                    </Button>
                  ))}
                </div>
              </div>

              <Button fullWidth onClick={() => setActiveOverlay(null)}>
                Save & Finish
              </Button>
            </Sheet>

            {/* D. NUTRITION FEATURE OVERLAY (Full App Screen Page) */}
            {activeOverlay === "nutrition" && (() => {
              const nutritionAccent = color.primary; /* TEMP: awaiting confirmed zone accent from product owner */
              const isNewUser = recentFoodLogs.length === 0;
              const presets = isNewUser ? ["Apple", "Oatmeal", "Greek Yogurt"] : recentFoodLogs;

              return (
                <Sheet
                  isOpen={activeOverlay === "nutrition"}
                  onClose={() => setActiveOverlay(null)}
                  title={nutritionTab === "analyser" ? "Food Scanner" : "Recipe Creator"}
                >
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", boxSizing: "border-box", transition: "background-color 0.3s" }}>

                  {/* Segmented Mode Controller Toggle */}
                  <div style={{ display: "flex", marginBottom: 20, backgroundColor: C.surfaceLight, borderRadius: 14, padding: 4, border: `1px solid ${C.border}` }}>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setNutritionTab("analyser");
                        setRecipeError(null);
                      }}
                      style={{
                        flex: 1, padding: "10px 12px", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700,
                        backgroundColor: nutritionTab === "analyser" ? C.surface : "transparent",
                        color: nutritionTab === "analyser" ? nutritionAccent : C.text2,
                        cursor: "pointer", transition: "color 0.2s, background-color 0.2s"
                      }}
                    >
                      🔍 Food Analyser
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setNutritionTab("creator");
                        setScannedFoodResult(null);
                        setScanConfidence(null);
                        setScanError(null);
                        setShowManualForm(false);
                      }}
                      style={{
                        flex: 1, padding: "10px 12px", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 700,
                        backgroundColor: nutritionTab === "creator" ? C.surface : "transparent",
                        color: nutritionTab === "creator" ? nutritionAccent : C.text2,
                        cursor: "pointer", transition: "color 0.2s, background-color 0.2s"
                      }}
                    >
                      🥞 Recipe Creator
                    </motion.button>
                  </div>

                  {/* Subscreen Content area */}
                  <div style={{ flex: 1, overflowY: "auto", paddingBottom: 16, scrollbarWidth: "none" }}>
                    <AnimatePresence mode="wait">
                      
                      {/* Sub-tab 1: FOOD ANALYSER */}
                      {nutritionTab === "analyser" && (
                        <motion.div
                          key="analyser-panel"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={SPRING}
                          style={{ display: "flex", flexDirection: "column", gap: 14 }}
                        >
                          <div className="card-light" style={{ padding: 18, border: `1px solid ${C.border}`, margin: 0 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text1, margin: "0 0 4px" }}>Food Scanner</h3>
                            <p style={{ fontSize: 11, color: C.text2, margin: "0 0 14px" }}>Capture food items to extract dynamic macro data instantly.</p>

                            {/* Scanner visual camera box */}
                            <div 
                              className="scanner-frame" 
                              style={{ 
                                marginBottom: 16, 
                                pointerEvents: analyzingFood ? "none" : "auto",
                                border: `2px dashed ${nutritionAccent}`
                              }}
                              onClick={() => handleSimulateScanFood("salad")}
                            >
                              {analyzingFood ? (
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <motion.div 
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                                    style={{
                                      width: 32, height: 32, borderRadius: "50%",
                                      border: `3px solid rgba(0, 229, 168, 0.2)`,
                                      borderTop: `3px solid ${nutritionAccent}`,
                                      marginBottom: 10
                                    }}
                                  />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Analyzing your meal…</span>
                                </div>
                              ) : (
                                <>
                                  <Camera size={32} color={nutritionAccent} style={{ marginBottom: 8 }} />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Open Camera / Scan Plate</span>
                                  <span style={{ fontSize: 10, color: C.text2, marginTop: 4 }}>or select from recent logs below</span>
                                </>
                              )}
                            </div>

                            {/* Presets / Recent Logs Grid */}
                            <h4 style={{ fontSize: 11, fontWeight: 800, color: C.text2, textTransform: "uppercase", margin: "0 0 8px" }}>
                              {isNewUser ? "Starter Presets" : "Frequently Logged"}
                            </h4>
                            <div style={{ display: "flex", gap: 8 }}>
                              {presets.map((foodName, idx) => {
                                const keyMap = { "Salad": "salad", "Chicken Rice": "chicken", "Protein Shake": "shake" };
                                const key = keyMap[foodName] || "salad";
                                return (
                                  <button 
                                    key={idx}
                                    onClick={() => handleSimulateScanFood(key)}
                                    style={{
                                      flex: 1, padding: "8px 10px", borderRadius: 10, border: `1px solid ${C.border}`,
                                      backgroundColor: C.surfaceLight, fontSize: 10, fontWeight: 700, color: C.text1, cursor: "pointer"
                                    }}
                                  >
                                    {foodName}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* API Failure State */}
                          {scanError && (
                            <div className="card-light" style={{ padding: 14, border: `1px solid ${C.accentOrange}`, backgroundColor: "rgba(255, 95, 31, 0.05)", margin: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 12, color: C.text1, fontWeight: 700 }}>{scanError}</span>
                              <button 
                                onClick={() => handleSimulateScanFood(lastScannedFoodKey)}
                                style={{
                                  padding: "6px 12px", borderRadius: 8, border: `1px solid ${nutritionAccent}`,
                                  backgroundColor: "transparent", color: nutritionAccent, fontWeight: 700, fontSize: 11, cursor: "pointer"
                                }}
                              >
                                Retry
                              </button>
                            </div>
                          )}

                          {/* Low Confidence State */}
                          {scanConfidence !== null && scanConfidence < 0.6 && !showManualForm && (
                            <div className="card-light" style={{ padding: 14, border: `1px solid ${C.border}`, margin: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 12, color: C.text1, fontWeight: 700 }}>Unable to identify this meal accurately.</span>
                              <button 
                                onClick={() => setShowManualForm(true)}
                                style={{
                                  padding: "6px 12px", borderRadius: 8, border: `1px solid ${nutritionAccent}`,
                                  backgroundColor: "transparent", color: nutritionAccent, fontWeight: 700, fontSize: 11, cursor: "pointer"
                                }}
                              >
                                Enter manually
                              </button>
                            </div>
                          )}

                          {/* Manual Food Entry Form */}
                          {showManualForm && (
                            <div className="card-light" style={{ padding: 18, border: `1.5px solid ${nutritionAccent}`, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                              <h4 style={{ fontSize: 14, fontWeight: 800, color: C.text1, margin: 0 }}>Manual Food Entry</h4>
                              
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 800, color: C.text2, textTransform: "uppercase" }}>Food Name</label>
                                <input 
                                  type="text" 
                                  value={manualFoodName} 
                                  onChange={(e) => setManualFoodName(e.target.value)} 
                                  placeholder="e.g. Avocado Toast" 
                                  style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surfaceLight, color: C.text1, outline: "none", fontSize: 12 }}
                                />
                              </div>

                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                <div>
                                  <label style={{ fontSize: 10, fontWeight: 800, color: C.text2, textTransform: "uppercase" }}>Calories</label>
                                  <input 
                                    type="number" 
                                    value={manualCalories} 
                                    onChange={(e) => setManualCalories(e.target.value)} 
                                    placeholder="kcal" 
                                    style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surfaceLight, color: C.text1, outline: "none", fontSize: 12 }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: 10, fontWeight: 800, color: C.text2, textTransform: "uppercase" }}>Protein (g)</label>
                                  <input 
                                    type="number" 
                                    value={manualProtein} 
                                    onChange={(e) => setManualProtein(e.target.value)} 
                                    placeholder="g" 
                                    style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surfaceLight, color: C.text1, outline: "none", fontSize: 12 }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: 10, fontWeight: 800, color: C.text2, textTransform: "uppercase" }}>Carbs (g)</label>
                                  <input 
                                    type="number" 
                                    value={manualCarbs} 
                                    onChange={(e) => setManualCarbs(e.target.value)} 
                                    placeholder="g" 
                                    style={{ width: "100%", padding: 10, marginTop: 4, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surfaceLight, color: C.text1, outline: "none", fontSize: 12 }}
                                  />
                                </div>
                              </div>

                              {/* Multiplier for manual entries */}
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 800, color: C.text2, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Select Portion Size</label>
                                <div style={{ display: "flex", gap: 6 }}>
                                  {[0.5, 1.0, 1.5, 2.0].map((m) => (
                                    <button 
                                      key={m} 
                                      onClick={() => setFoodMultiplier(m)}
                                      style={{
                                        flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                                        border: `1.5px solid ${foodMultiplier === m ? nutritionAccent : C.border}`,
                                        backgroundColor: foodMultiplier === m ? "rgba(0, 229, 168, 0.08)" : "transparent",
                                        color: foodMultiplier === m ? nutritionAccent : C.text1
                                      }}
                                    >
                                      {m}x
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Recalculated values teaser */}
                              <div style={{ padding: 12, backgroundColor: C.surfaceLight, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 11, color: C.text2 }}>Calculated:</span>
                                <span style={{ fontSize: 12, fontWeight: 800, color: nutritionAccent }}>
                                  {Math.round((parseInt(manualCalories) || 0) * foodMultiplier)} kcal &bull; {Math.round((parseInt(manualProtein) || 0) * foodMultiplier)}g Protein
                                </span>
                              </div>

                              <button 
                                onClick={() => {
                                  const name = manualFoodName.trim() || "Manual Log";
                                  const c = Math.round((parseInt(manualCalories) || 0) * foodMultiplier);
                                  setUser(prev => ({ ...prev, calToday: prev.calToday + c }));
                                  setRecentFoodLogs(prev => [...new Set([name, ...prev])].slice(0, 3));
                                  triggerAlert(`Logged ${name} (${c} kcal)!`);
                                  
                                  setManualFoodName("");
                                  setManualCalories("");
                                  setManualProtein("");
                                  setManualCarbs("");
                                  setScanConfidence(null);
                                  setShowManualForm(false);
                                  setFoodMultiplier(1);
                                }}
                                style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: nutritionAccent, color: "white", fontWeight: 800, fontSize: 12, cursor: "pointer" }}
                              >
                                Log to Dashboard
                              </button>
                            </div>
                          )}

                          {/* Scanner Result Details + Portion Stepper */}
                          {scannedFoodResult && (
                            <div className="card-light" style={{ padding: 18, border: `1.5px solid ${nutritionAccent}`, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                  <span style={{ fontSize: 10, fontWeight: 800, color: nutritionAccent, textTransform: "uppercase" }}>Rex AI Scan Success</span>
                                  <h4 style={{ fontSize: 16, fontWeight: 900, color: C.text1, margin: "2px 0 0" }}>{scannedFoodResult.name}</h4>
                                </div>
                                <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "rgba(0, 168, 107, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent, fontWeight: 800, fontSize: 14 }}>
                                  {scannedFoodResult.grade}
                                </div>
                              </div>

                              {/* Multiplier / Serving Stepper */}
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 800, color: C.text2, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Select Portion Size</label>
                                <div style={{ display: "flex", gap: 6 }}>
                                  {[0.5, 1.0, 1.5, 2.0].map((m) => (
                                    <button 
                                      key={m} 
                                      onClick={() => setFoodMultiplier(m)}
                                      style={{
                                        flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                                        border: `1.5px solid ${foodMultiplier === m ? nutritionAccent : C.border}`,
                                        backgroundColor: foodMultiplier === m ? "rgba(0, 229, 168, 0.08)" : "transparent",
                                        color: foodMultiplier === m ? nutritionAccent : C.text1
                                      }}
                                    >
                                      {m}x
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Recalculated Macros grid */}
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                                <div style={{ backgroundColor: C.surfaceLight, borderRadius: 10, padding: 10, textAlign: "center" }}>
                                  <div style={{ fontSize: 15, fontWeight: 800, color: C.text1 }}>{Math.round(scannedFoodResult.calories * foodMultiplier)}</div>
                                  <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Calories</div>
                                </div>
                                <div style={{ backgroundColor: C.surfaceLight, borderRadius: 10, padding: 10, textAlign: "center" }}>
                                  <div style={{ fontSize: 15, fontWeight: 800, color: nutritionAccent }}>{Math.round(scannedFoodResult.protein * foodMultiplier)}g</div>
                                  <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Protein</div>
                                </div>
                                <div style={{ backgroundColor: C.surfaceLight, borderRadius: 10, padding: 10, textAlign: "center" }}>
                                  <div style={{ fontSize: 15, fontWeight: 800, color: C.blue }}>{Math.round(scannedFoodResult.carbohydrates * foodMultiplier)}g</div>
                                  <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Carbs</div>
                                </div>
                              </div>

                              {/* Detailed sub-nutrition specs */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                                {[
                                  { label: "Fat", val: `${Math.round(scannedFoodResult.fat * foodMultiplier)}g` },
                                  { label: "Fiber", val: `${Math.round(scannedFoodResult.fiber * foodMultiplier)}g` },
                                  { label: "Sugar", val: `${Math.round(scannedFoodResult.sugar * foodMultiplier)}g` },
                                  { label: "Sodium", val: `${Math.round(scannedFoodResult.sodium * foodMultiplier)}mg` }
                                ].map((spec, i) => (
                                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                                    <span style={{ color: C.text2 }}>{spec.label}</span>
                                    <span style={{ fontWeight: 700, color: C.text1 }}>{spec.val}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Rex Recommendation */}
                              <div style={{ display: "flex", gap: 10, backgroundColor: "rgba(0, 229, 168, 0.05)", padding: 12, borderRadius: 12 }}>
                                <Sparkles size={16} color={nutritionAccent} style={{ flexShrink: 0, marginTop: 1 }} />
                                <span style={{ fontSize: 10, color: C.text1, lineHeight: 1.4 }}>{scannedFoodResult.tips}</span>
                              </div>

                              {/* Log Meal CTA */}
                              <button 
                                onClick={() => {
                                  const name = scannedFoodResult.name;
                                  const c = Math.round(scannedFoodResult.calories * foodMultiplier);
                                  setUser(prev => ({ ...prev, calToday: prev.calToday + c }));
                                  setRecentFoodLogs(prev => [...new Set([name, ...prev])].slice(0, 3));
                                  triggerAlert(`Logged ${name} (${c} kcal)!`);
                                  
                                  setScannedFoodResult(null);
                                  setScanConfidence(null);
                                  setFoodMultiplier(1);
                                }}
                                style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", backgroundColor: nutritionAccent, color: "white", fontWeight: 800, fontSize: 12, cursor: "pointer" }}
                              >
                                Log to Dashboard
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Sub-tab 2: RECIPE CREATOR */}
                      {nutritionTab === "creator" && (
                        <motion.div
                          key="creator-panel"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={SPRING}
                          style={{ display: "flex", flexDirection: "column", gap: 14 }}
                        >
                          <div className="card-light" style={{ padding: 18, border: `1px solid ${C.border}`, margin: 0 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text1, margin: "0 0 4px" }}>Recipe Creator</h3>
                            <p style={{ fontSize: 11, color: C.text2, margin: "0 0 14px" }}>Scan ingredients or search manually to generate custom diet choices.</p>

                            {/* Scanner visual camera box */}
                            <div 
                              className="scanner-frame" 
                              style={{ 
                                marginBottom: 16,
                                border: `2px dashed ${nutritionAccent}`
                              }} 
                              onClick={() => {
                                setRecipeIngredients(prev => [...new Set([...prev, "Oats", "Avocado", "Chicken"])]);
                                triggerAlert("Scanned ingredients successfully! 🥬");
                              }}
                            >
                              {generatingRecipes && <div className="scanning-line"></div>}
                              <Camera size={32} color={nutritionAccent} style={{ marginBottom: 8 }} />
                              <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>
                                Open Camera / Scan Raw Ingredients
                              </span>
                              <span style={{ fontSize: 10, color: C.text2, marginTop: 4 }}>
                                (Simulates scanning Oats, Avocado, Chicken)
                              </span>
                            </div>

                            {/* Manual Input layout */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                              <input
                                type="text"
                                value={manualIngredientInput}
                                onChange={(e) => setManualIngredientInput(e.target.value)}
                                placeholder="Type ingredient (e.g. egg, fail)..."
                                onKeyDown={(e) => e.key === "Enter" && handleAddManualIngredient()}
                                style={{
                                  flex: 1, padding: "10px 14px", borderRadius: 10, border: `1px solid ${C.border}`,
                                  backgroundColor: C.surfaceLight, fontSize: 12, outline: "none", color: C.text1
                                }}
                              />
                              {/* Secondary Outline style button */}
                              <button 
                                onClick={handleAddManualIngredient} 
                                style={{ 
                                  padding: "10px 14px", borderRadius: 10, 
                                  border: `1.5px solid ${nutritionAccent}`, 
                                  backgroundColor: "transparent", color: nutritionAccent, 
                                  fontWeight: 700, fontSize: 12, cursor: "pointer" 
                                }}
                              >
                                Add
                              </button>
                            </div>

                            {/* Selected Ingredients tag list - Rendered below input row */}
                            {recipeIngredients.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                                {recipeIngredients.map((ing, i) => (
                                  <div 
                                    key={i} 
                                    style={{ 
                                      display: "flex", alignItems: "center", gap: 6, 
                                      padding: "4px 10px", backgroundColor: C.surfaceLight, 
                                      border: `1.5px solid ${C.border}`, borderRadius: 12, 
                                      fontSize: 11, fontWeight: 700, color: C.text1 
                                    }}
                                  >
                                    <span>{ing}</span>
                                    <button 
                                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: C.text2, display: "flex", alignItems: "center" }} 
                                      onClick={() => setRecipeIngredients(recipeIngredients.filter(x => x !== ing))}
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Generate Recipes solid-filled CTA (disabled if list empty) */}
                            <Button 
                              disabled={recipeIngredients.length === 0}
                              onClick={() => {
                                if (recipeIngredients.length === 0) {
                                  triggerAlert("Please scan or add at least one ingredient first!");
                                  return;
                                }
                                setGeneratingRecipes(true);
                                setRecipeError(null);
                                setRecipesResult(null);

                                setTimeout(() => {
                                  setGeneratingRecipes(false);
                                  setRecipesResult([
                                    {
                                      title: "High-Protein Oatmeal Bowl",
                                      calories: 420,
                                      protein: 28,
                                      carbs: 56,
                                      time: "8 mins",
                                      ingredients: ["1 scoop Protein Powder", "50g Oats", "1/2 Scanned Banana", "150ml milk"],
                                      youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    },
                                    {
                                      title: "Banana Oat Pancakes",
                                      calories: 380,
                                      protein: 22,
                                      carbs: 48,
                                      time: "12 mins",
                                      ingredients: ["1 Scanned Banana", "40g Oats", "2 Eggs", "1/2 tsp cinnamon"],
                                      youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    }
                                  ]);
                                  triggerAlert("Rex AI generated 2 recipes! 🥞");
                                }, 2000);
                              }}
                              fullWidth
                            >
                              {generatingRecipes ? "REX IS GENERATING RECIPES..." : "GENERATE REX RECIPES"}
                            </Button>
                          </div>

                          {/* AI Recipe Generator Results */}
                          <AnimatePresence>
                            {recipesResult && (
                              <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                style={{ display: "flex", flexDirection: "column", gap: 14 }}
                              >
                                <h3 style={{ fontSize: 13, fontWeight: 800, color: C.text2, margin: 0, textTransform: "uppercase" }}>Recommended AI Recipes</h3>
                                {recipesResult.map((recipe, idx) => (
                                  <div key={idx} className="card-light" style={{ padding: 16, border: `1px solid ${C.border}`, margin: 0 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                      <div>
                                        <h4 style={{ fontSize: 14, fontWeight: 900, color: C.text1, margin: 0 }}>{recipe.title}</h4>
                                        <div style={{ fontSize: 9, color: C.text2, marginTop: 4, fontWeight: 700 }}>
                                          {recipe.time} &bull; {recipe.calories} Kcal &bull; {recipe.protein}g Protein
                                        </div>
                                      </div>
                                    </div>

                                    {/* Ingredient list */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                                      {recipe.ingredients.map((ing, i) => (
                                        <span key={i} style={{ fontSize: 10, color: C.text1, display: "flex", alignItems: "center", gap: 6 }}>
                                          <span style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: nutritionAccent }} />
                                          {ing}
                                        </span>
                                      ))}
                                    </div>

                                    {/* Clickable Youtube Link preview box */}
                                    <a 
                                      href={recipe.youtube} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      style={{
                                        display: "flex", alignItems: "center", gap: 10, textDecoration: "none",
                                        backgroundColor: "rgba(211, 47, 47, 0.08)", padding: "10px 14px", borderRadius: 10,
                                        border: "1px solid rgba(211, 47, 47, 0.2)", cursor: "pointer"
                                      }}
                                    >
                                      <Youtube size={16} color={color.error} fill={color.error} />
                                      <span style={{ fontSize: 11, fontWeight: 700, color: color.error }}>Watch Video Recipe Tutorial</span>
                                    </a>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                </div>
              </Sheet>
            );
            })()}

            {/* E. PROGRESS OVERLAY (Re-implemented per Progress Implementation Spec) */}
            {activeOverlay === "progress" && (
              <motion.div
                key="progress-screen"
                initial={{ opacity: 0, y: 960 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 960 }}
                transition={{ type: "spring", damping: 28 }}
                style={{
                  position: "absolute", inset: 0, backgroundColor: C.appBg, zIndex: 1000,
                  display: "flex", flexDirection: "column", boxSizing: "border-box",
                  padding: "54px 20px 24px", transition: "background-color 0.3s"
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text1, margin: 0 }}>Progress</h2>
                    <span style={{ fontSize: 11, color: C.text2 }}>Your real-time fitness metrics</span>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`,
                      backgroundColor: C.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                    }}
                    onClick={() => setActiveOverlay(null)}
                  >
                    <X size={16} color={C.text1} />
                  </motion.button>
                </div>

                <div style={{ flex: 1, overflowY: "auto", paddingRight: 4, paddingBottom: 24, scrollbarWidth: "none" }}>
                  {/* 1. AVATAR HERO ZONE */}
                  <div style={{ position: "relative", width: "100%", height: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: appTheme === "dark" ? color.surface : "#F0F4FF", borderRadius: 24, padding: 12, marginBottom: 16, border: `1.5px solid ${C.border}`, overflow: "hidden" }}>
                    {avatarLoadError ? (
                      // Static Avatar Fallback
                      <img 
                        src="/record_header.png" 
                        alt="Avatar Companion" 
                        style={{ height: "100%", width: "auto", objectFit: "contain", borderRadius: 16 }}
                      />
                    ) : (
                      // Interactive <model-viewer> custom element
                      <model-viewer
                        src="https://modelviewer.dev/shared-assets/models/RobotExpressive.glb"
                        auto-rotate
                        camera-controls
                        shadow-intensity="1"
                        style={{ width: "100%", height: "100%", background: "transparent" }}
                        onError={() => setAvatarLoadError(true)}
                      />
                    )}
                    
                    {/* Subtle Glowing Pulse behind model */}
                    <div style={{ position: "absolute", width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle, rgba(91,140,255,0.2) 0%, rgba(0,0,0,0) 70%)", zIndex: 0, pointerEvents: "none" }} />
                  </div>

                  {/* <RexBubble> speech text */}
                  <div className="card-light" style={{ display: "flex", gap: 10, padding: 14, margin: "0 0 16px", border: `1px solid ${C.border}`, position: "relative" }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(156,39,176,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Sparkles size={14} color={color.secondary} />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: "800", color: color.secondary, textTransform: "uppercase", marginBottom: 2 }}>Rex AI Companion</div>
                      <p style={{ fontSize: 11, color: C.text1, margin: 0, lineHeight: 1.4 }}>
                        "Welcome back, Arjun! Ready to conquer today's Recommended Workout? Let's keep that 12-day streak glowing!"
                      </p>
                    </div>
                  </div>

                  {/* 2. CORE METRICS ROW (Streak, Calories, Water Ring) */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    {/* Metric 1: Streak */}
                    <div className="card-light" style={{ flex: 1, margin: 0, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: `1px solid ${C.border}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(255,95,31,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                        <TrendingUp size={14} color={C.accentOrange} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: C.accentOrange }}>{user.streak} Days</span>
                      <span style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Current Streak</span>
                    </div>

                    {/* Metric 2: Calories */}
                    <div className="card-light" style={{ flex: 1, margin: 0, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: `1px solid ${C.border}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(0,168,107,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                        <ChefHat size={14} color={C.accent} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>{user.calToday} kcal</span>
                      <span style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>of {user.calGoal} Target</span>
                    </div>

                    {/* Metric 3: Water Ring */}
                    <div className="card-light" style={{ flex: 1, margin: 0, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: `1px solid ${C.border}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(0,122,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                        <ShoppingBag size={14} color={color.secondary} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>{user.waterToday}L</span>
                      <span style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>of {user.waterGoal}L Goal</span>
                    </div>
                  </div>

                  {/* 3. TODAY'S WORKOUT (CTA) - Single dominant primary action */}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveOverlay("active_workout");
                    }}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: 16,
                      background: "linear-gradient(135deg, color.primary 0%, color.primary 100%)",
                      color: "white",
                      border: "none",
                      fontWeight: "800",
                      fontSize: 14,
                      letterSpacing: "0.5px",
                      boxShadow: "0 8px 24px rgba(0, 229, 168, 0.35)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      marginBottom: 20
                    }}
                  >
                    <Dumbbell size={16} color="white" />
                    ▶ TODAY'S WORKOUT
                  </motion.button>

                  {/* 4. QUICK ACCESS GRID (Zone-Themed Cards) */}
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: C.text2, textTransform: "uppercase", margin: "0 0 10px" }}>Access Zones</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                    
                    {/* Card 1: Workout */}
                    <div 
                      data-zone="workout"
                      className="card-light" 
                      onClick={() => {
                        setTab("plan");
                        setActiveOverlay(null);
                      }}
                      style={{ margin: 0, padding: 14, cursor: "pointer" }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>Workout Plan</div>
                      <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Recommended: Upper body</div>
                    </div>

                    {/* Card 2: Yoga */}
                    <div 
                      data-zone="yoga"
                      className="card-light" 
                      onClick={() => setActiveOverlay("yoga")}
                      style={{ margin: 0, padding: 14, cursor: "pointer" }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>Yoga Recovery</div>
                      <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>5 mins stretch active</div>
                    </div>

                    {/* Card 3: Skincare */}
                    <div 
                      data-zone="skincare"
                      className="card-light" 
                      onClick={() => setActiveOverlay("skincare")}
                      style={{ margin: 0, padding: 14, cursor: "pointer" }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>Skincare</div>
                      <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Morning routine log</div>
                    </div>

                    {/* Card 4: Mood */}
                    <div 
                      data-zone="mood"
                      className="card-light" 
                      onClick={() => triggerAlert("Mood checked in: Good!")}
                      style={{ margin: 0, padding: 14, cursor: "pointer" }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>Mood Check-in</div>
                      <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Current: Calm</div>
                    </div>

                    {/* Card 5: Leaderboard (Opens Modal) */}
                    <div 
                      data-zone="leaderboard"
                      className="card-light" 
                      onClick={() => setActiveZoneModal("leaderboard")}
                      style={{ margin: 0, padding: 14, cursor: "pointer" }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>Leaderboard</div>
                      <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Rank #24 (Teaser View)</div>
                    </div>

                    {/* Card 6: Supplements (Opens Modal) */}
                    <div 
                      data-zone="supplements"
                      className="card-light" 
                      onClick={() => setActiveZoneModal("supplements")}
                      style={{ margin: 0, padding: 14, cursor: "pointer" }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>Supplements</div>
                      <div style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Check Cabinet Stock</div>
                    </div>
                  </div>
                </div>

                {/* ZONE BOTTOM SHEET MODALS */}
                <AnimatePresence>
                  {activeZoneModal && (
                    <motion.div
                      key="modal-backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1200,
                        display: "flex", alignItems: "flex-end", justifyContent: "center"
                      }}
                      onClick={() => setActiveZoneModal(null)}
                    >
                      <motion.div
                        key="modal-sheet"
                        initial={{ y: 300 }}
                        animate={{ y: 0 }}
                        exit={{ y: 300 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        style={{
                          width: "100%",
                          backgroundColor: C.surface,
                          borderTopLeftRadius: 24,
                          borderTopRightRadius: 24,
                          padding: "24px 20px 40px",
                          boxSizing: "border-box",
                          borderTop: `1.5px solid ${C.border}`
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Pull Bar */}
                        <div style={{ width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, margin: "0 auto 18px" }} />

                        {activeZoneModal === "leaderboard" ? (
                          // LEADERBOARD MODAL SHEET
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                              <h3 style={{ fontSize: 16, fontWeight: 900, color: C.text1, margin: 0 }}>Leaderboard Rankings</h3>
                              <X size={16} color={C.text2} onClick={() => setActiveZoneModal(null)} style={{ cursor: "pointer" }} />
                            </div>
                            
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 220, overflowY: "auto" }}>
                              {[
                                { rank: 1, name: "FitRaj_21", xp: "2,400 XP", active: false },
                                { rank: 2, name: "GymQueen", xp: "1,850 XP", active: false },
                                { rank: 3, name: "IronMike", xp: "1,600 XP", active: false },
                                { rank: 24, name: "Arjun (You)", xp: "1,240 XP", active: true }
                              ].map((item, idx) => (
                                <div 
                                  key={idx} 
                                  style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "10px 14px", borderRadius: 10,
                                    backgroundColor: item.active ? "rgba(0, 168, 107, 0.08)" : C.surfaceLight,
                                    border: item.active ? `1px solid ${C.accent}` : `1px solid ${C.border}`
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: item.active ? C.accent : C.text2, width: 20 }}>#{item.rank}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>{item.name}</span>
                                  </div>
                                  <span style={{ fontSize: 11, fontWeight: 700, color: C.text2 }}>{item.xp}</span>
                                </div>
                              ))}
                            </div>

                            <div style={{ fontSize: 10, color: C.text2, borderTop: `1px solid ${C.border}`, marginTop: 14, paddingTop: 10, fontStyle: "italic", textAlign: "center" }}>
                              ⚠️ Open Decision: Awaiting Shalem's final go-ahead on anti-comparison rankings policy.
                            </div>
                          </div>
                        ) : (
                          // SUPPLEMENTS MODAL SHEET
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                              <h3 style={{ fontSize: 16, fontWeight: 900, color: C.text1, margin: 0 }}>Supplement Cabinet</h3>
                              <X size={16} color={C.text2} onClick={() => setActiveZoneModal(null)} style={{ cursor: "pointer" }} />
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              {[
                                { name: "Whey Protein (Vanilla)", stock: "90% remaining", ok: true },
                                { name: "Creatine Monohydrate", stock: "40% remaining", ok: true },
                                { name: "Multivitamin Gummies", stock: "12 days supply", ok: true },
                                { name: "Pre-Workout (Blue Razz)", stock: "OUT OF STOCK", ok: false }
                              ].map((item, idx) => (
                                <div 
                                  key={idx}
                                  style={{
                                    display: "flex", justifyContent: "space-between", alignItems: "center",
                                    padding: "10px 14px", borderRadius: 10,
                                    backgroundColor: C.surfaceLight, border: `1px solid ${C.border}`
                                  }}
                                >
                                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>{item.name}</span>
                                  <span style={{ fontSize: 10, fontWeight: 800, color: item.ok ? C.accent : C.accentOrange }}>
                                    {item.stock}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.98 }}
                              onClick={() => triggerAlert("Order placed for out-of-stock items!")}
                              style={{
                                width: "100%", padding: 12, borderRadius: 12, backgroundColor: color.secondary,
                                border: "none", color: "white", fontSize: 12, fontWeight: 800, marginTop: 14, cursor: "pointer"
                              }}
                            >
                              Restock Out of Stock Items
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* F. GENERIC "YET TO COME" FEATURE OVERLAYS (Rex Coach, Yoga, Skincare, Supplements) */}
            {["rex_coach", "yoga", "skincare", "supplements"].includes(activeOverlay) && (
              <motion.div
                key="yet-to-come-screen"
                initial={{ opacity: 0, y: 960 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 960 }}
                transition={{ type: "spring", damping: 28 }}
                style={{
                  position: "absolute", inset: 0, backgroundColor: C.appBg, zIndex: 1000,
                  display: "flex", flexDirection: "column", boxSizing: "border-box",
                  padding: "54px 20px 24px", transition: "background-color 0.3s"
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%",
                      backgroundColor: activeOverlay === "rex_coach" ? "rgba(156, 39, 176, 0.12)" : activeOverlay === "yoga" ? "rgba(127, 93, 240, 0.15)" : activeOverlay === "supplements" ? "rgba(255, 152, 0, 0.12)" : "rgba(233, 30, 99, 0.12)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {activeOverlay === "rex_coach" ? <Sparkles size={18} color={color.secondary} /> : activeOverlay === "yoga" ? <Dumbbell size={18} color={color.secondary} /> : activeOverlay === "supplements" ? <ShoppingBag size={18} color={color.warning} /> : <Sparkles size={18} color={color.error} />}
                    </div>
                    <h2 style={{ fontSize: 18, fontWeight: 900, color: C.text1, margin: 0, textTransform: "capitalize" }}>
                      {activeOverlay === "rex_coach" ? "Rex AI Coach" : activeOverlay}
                    </h2>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`,
                      backgroundColor: C.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0
                    }}
                    onClick={() => setActiveOverlay(null)}
                  >
                    <X size={16} color={C.text1} />
                  </motion.button>
                </div>

                {/* Dead Center Content */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <div style={{ fontSize: 44 }}>✨</div>
                  <div style={{ fontSize: 24, fontWeight: "900", color: C.text1, letterSpacing: "-0.5px" }}>Yet to come</div>
                  <div style={{ fontSize: 12, color: C.text2, textAlign: "center", maxWidth: "80%", lineHeight: 1.4 }}>
                    This feature is currently under active development. Stay tuned for the upcoming release!
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════════════════════════════════════════════════════════
           5-ICON BOTTOM NAVIGATION BAR (FLOATING DOCK)
           ═══════════════════════════════════════════════════════════ */}
        <div className="bottom-nav-bar">
          {/* Tab 1: Home */}
          <button className="nav-item" onClick={() => { setTab("home"); setActiveOverlay(null); }} style={{ position: "relative" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              backgroundColor: tab === "home" && !activeOverlay ? "rgba(0, 168, 107, 0.12)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}>
              <HomeIcon size={24} color={tab === "home" && !activeOverlay ? C.accent : C.text2} />
            </div>
          </button>

          {/* Tab 2: Plan (Workout) */}
          <button className="nav-item" onClick={() => { setTab("plan"); setActiveOverlay(null); }} style={{ position: "relative" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              backgroundColor: tab === "plan" ? "rgba(127, 93, 240, 0.15)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}>
              <Dumbbell size={24} color={tab === "plan" ? color.secondary : C.text2} />
            </div>
          </button>

          {/* Floating plus button */}
          <button className="nav-item" style={{ position: "relative", top: -14 }} onClick={() => setActiveOverlay("quick_log")}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              backgroundColor: C.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 16px rgba(0, 168, 107, 0.25)"
            }}>
              <Plus size={28} color="white" strokeWidth={3} />
            </div>
          </button>

          {/* Tab 4: Community */}
          <button className="nav-item" onClick={() => { setTab("community"); setActiveOverlay(null); }} style={{ position: "relative" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              backgroundColor: tab === "community" ? "rgba(0, 168, 107, 0.12)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}>
              <Users size={24} color={tab === "community" ? C.accent : C.text2} />
            </div>
          </button>

          {/* Tab 5: Profile */}
          <button className="nav-item" onClick={() => { setTab("profile"); setActiveOverlay(null); }} style={{ position: "relative" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              backgroundColor: tab === "profile" ? "rgba(142, 142, 147, 0.15)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}>
              <User size={24} color={tab === "profile" ? C.accent : C.text2} />
            </div>
          </button>
        </div>

        {/* Persistent AI Coach Orb Companion */}
        <motion.div
          layout
          animate={!isOrbExpanded ? {
            y: [0, -3, 0],
            scale: [1, 1.03, 1],
            boxShadow: appTheme === "dark" 
              ? [
                  "0 0 20px rgba(233, 64, 87, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
                  "0 0 30px rgba(233, 64, 87, 0.8), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
                  "0 0 20px rgba(233, 64, 87, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)"
                ]
              : [
                  "0 8px 24px rgba(233, 64, 87, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)",
                  "0 8px 32px rgba(233, 64, 87, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.5)",
                  "0 8px 24px rgba(233, 64, 87, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.5)"
                ]
          } : {}}
          whileTap={!isOrbExpanded ? { scale: 0.94 } : {}}
          transition={!isOrbExpanded ? {
            layout: { type: "spring", damping: 25, stiffness: 150 },
            y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            boxShadow: { repeat: Infinity, duration: 4, ease: "easeInOut" }
          } : {
            layout: { type: "spring", damping: 26, stiffness: 170 }
          }}
          style={getOrbStyle()}
          onClick={handleOrbClick}
        >
          {isOrbExpanded ? (
            // Expanded Chat Window
            <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, paddingBottom: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%",
                    background: "linear-gradient(135deg, color.secondary 0%, color.error 50%, color.warning 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(233, 64, 87, 0.3)"
                  }}>
                    <Sparkles size={18} color={color.text1} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 900, color: C.text1 }}>Rex AI Coach</div>
                    <div style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>ONLINE</div>
                  </div>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 36, height: 36, borderRadius: "50%", border: `1px solid ${C.border}`,
                    backgroundColor: C.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOrbExpanded(false);
                  }}
                >
                  <X size={16} color={C.text1} />
                </motion.button>
              </div>

              {/* Messages Body */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, paddingBottom: 12, scrollbarWidth: "none" }}>
                {chatMessages.map((msg, i) => {
                  const isRex = msg.sender === "rex";
                  return (
                    <div key={i} style={{
                      maxWidth: "80%", alignSelf: isRex ? "flex-start" : "flex-end",
                      backgroundColor: isRex ? C.surfaceLight : "rgba(0, 168, 107, 0.08)",
                      border: isRex ? `1px solid ${C.border}` : `1px solid rgba(0, 168, 107, 0.2)`,
                      borderRadius: 16, padding: "10px 14px", boxSizing: "border-box"
                    }}>
                      <div style={{ fontSize: 13, color: C.text1, lineHeight: 1.5 }}>{msg.text}</div>
                      <div style={{ fontSize: 8, color: C.text2, textAlign: "right", marginTop: 4 }}>{msg.time}</div>
                    </div>
                  );
                })}
              </div>

              {/* Input text Box */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask Rex (e.g. snack, stretch)..."
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  style={{
                    flex: 1, padding: "12px 16px", borderRadius: 14, border: `1px solid ${C.border}`,
                    backgroundColor: C.surfaceLight, color: C.text1, outline: "none", fontSize: 14
                  }}
                />
                <button 
                  onClick={handleSendMessage}
                  style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: C.accent, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          ) : (
            // Collapsed Orb Content
            <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                style={{
                  position: "absolute", width: "100%", height: "100%", borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(233,64,87,0.4) 0%, rgba(233,64,87,0) 70%)",
                  zIndex: -1
                }}
              />
              <Sparkles size={20} color={color.text1} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }} />
            </div>
          )}
        </motion.div>
      </div>
      )}
    </div>
  );
}

function CoffeeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6" y1="2" y2="4" />
      <line x1="10" x2="10" y1="2" y2="4" />
      <line x1="14" x2="14" y1="2" y2="4" />
    </svg>
  );
}
