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
import TiltCard from "./components/TiltCard";
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
  shadow: "var(--shadow-extruded)",
  btnShadow: "var(--shadow-button)",
  nutritionShadow: "var(--shadow-extruded)"
};

export default function App() {
  const SHOW_LEADERBOARD = false;
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
  
  // Carousel State Variables
  const [carouselIndex, setCarouselIndex] = useState(0); // 0 to 4 (Overview, Streak, Water, Steps, Calories)
  const [expandedCarouselSlide, setExpandedCarouselSlide] = useState(null); // null or index
  const [reminderActive, setReminderActive] = useState(false);
  const [waterLogs, setWaterLogs] = useState([
    { time: "08:00 AM", amount: 0.4 },
    { time: "11:30 AM", amount: 0.5 },
    { time: "02:15 PM", amount: 0.3 },
    { time: "05:00 PM", amount: 0.4 }
  ]);
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
  const [progressChartMode, setProgressChartMode] = useState("week"); // "week" | "month"
  const [nutritionDaily, setNutritionDaily] = useState({
    calories_consumed: 1240,
    calorie_target: 2000,
    protein_g: 68,
    carbs_g: 140,
    fats_g: 32,
    meals_logged: ["breakfast", "lunch"]
  });
  const [recentFoodLogs, setRecentFoodLogs] = useState(["Salad", "Chicken Rice", "Protein Shake"]);
  
  const generateMockPlan = (dietType = "vegetarian", calTarget = 2000) => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const planDays = {};
    
    const mealOptions = {
      breakfast: [
        { name: "Oatmeal with Almonds & Berries", calories: 350, protein_g: 12, carbs_g: 50, fats_g: 10 },
        { name: "Avocado Toast with Poached Egg", calories: 400, protein_g: 14, carbs_g: 35, fats_g: 22 },
        { name: "Greek Yogurt Parfait with Honey", calories: 300, protein_g: 18, carbs_g: 30, fats_g: 6 },
        { name: "Protein Smoothie Bowl", calories: 380, protein_g: 25, carbs_g: 45, fats_g: 8 }
      ],
      lunch: [
        { name: "Quinoa Salad with Chickpeas", calories: 550, protein_g: 18, carbs_g: 65, fats_g: 15 },
        { name: "Tofu & Vegetable Stir Fry", calories: 500, protein_g: 22, carbs_g: 48, fats_g: 18 },
        { name: "Lentil Soup with Whole Wheat Roll", calories: 480, protein_g: 20, carbs_g: 60, fats_g: 8 },
        { name: "Paneer Wrap with Mint Chutney", calories: 600, protein_g: 24, carbs_g: 42, fats_g: 26 }
      ],
      dinner: [
        { name: "Sweet Potato & Black Bean Bowl", calories: 600, protein_g: 16, carbs_g: 80, fats_g: 14 },
        { name: "Grilled Salmon with Asparagus", calories: 650, protein_g: 42, carbs_g: 10, fats_g: 30 },
        { name: "Paneer Butter Masala & Roti", calories: 680, protein_g: 22, carbs_g: 55, fats_g: 28 },
        { name: "Brown Rice with Dal & Spinach", calories: 520, protein_g: 18, carbs_g: 70, fats_g: 10 }
      ],
      snacks: [
        { name: "Mixed Nuts & Apple", calories: 200, protein_g: 5, carbs_g: 25, fats_g: 12 },
        { name: "Hummus & Carrot Sticks", calories: 150, protein_g: 6, carbs_g: 15, fats_g: 8 },
        { name: "Whey Protein Shake", calories: 180, protein_g: 25, carbs_g: 5, fats_g: 2 },
        { name: "Rice Cakes with Peanut Butter", calories: 220, protein_g: 7, carbs_g: 20, fats_g: 12 }
      ]
    };

    days.forEach(day => {
      const isVeg = dietType.toLowerCase() === "vegetarian" || dietType.toLowerCase() === "vegan";
      
      const bOption = mealOptions.breakfast[Math.floor(Math.random() * mealOptions.breakfast.length)];
      
      let lOption = mealOptions.lunch[Math.floor(Math.random() * mealOptions.lunch.length)];
      if (!isVeg && Math.random() > 0.5) {
        lOption = { name: "Grilled Chicken & Quinoa", calories: 580, protein_g: 45, carbs_g: 40, fats_g: 12 };
      }
      
      let dOption = mealOptions.dinner[Math.floor(Math.random() * mealOptions.dinner.length)];
      if (!isVeg && Math.random() > 0.3) {
        dOption = mealOptions.dinner[1]; // salmon
      }
      
      const sOption = mealOptions.snacks[Math.floor(Math.random() * mealOptions.snacks.length)];
      
      planDays[day] = {
        breakfast: bOption,
        lunch: lOption,
        dinner: dOption,
        snacks: sOption
      };
    });

    return {
      plan_id: "PLAN_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      user_id: "UID_REFERENCE",
      diet_type: dietType,
      calorie_target: calTarget,
      week_start_date: "2026-07-06",
      days: planDays,
      generated_at: new Date().toISOString(),
      last_regenerated_at: new Date().toISOString()
    };
  };

  const [mealPlan, setMealPlan] = useState(null);
  const [plannerActiveDay, setPlannerActiveDay] = useState("monday");

  const handleSwapMeal = (day, mealType) => {
    const mealOptions = {
      breakfast: [
        { name: "Oatmeal with Almonds & Berries", calories: 350, protein_g: 12, carbs_g: 50, fats_g: 10 },
        { name: "Avocado Toast with Poached Egg", calories: 400, protein_g: 14, carbs_g: 35, fats_g: 22 },
        { name: "Greek Yogurt Parfait with Honey", calories: 300, protein_g: 18, carbs_g: 30, fats_g: 6 },
        { name: "Protein Smoothie Bowl", calories: 380, protein_g: 25, carbs_g: 45, fats_g: 8 }
      ],
      lunch: [
        { name: "Quinoa Salad with Chickpeas", calories: 550, protein_g: 18, carbs_g: 65, fats_g: 15 },
        { name: "Tofu & Vegetable Stir Fry", calories: 500, protein_g: 22, carbs_g: 48, fats_g: 18 },
        { name: "Lentil Soup with Whole Wheat Roll", calories: 480, protein_g: 20, carbs_g: 60, fats_g: 8 },
        { name: "Paneer Wrap with Mint Chutney", calories: 600, protein_g: 24, carbs_g: 42, fats_g: 26 },
        { name: "Grilled Chicken & Quinoa", calories: 580, protein_g: 45, carbs_g: 40, fats_g: 12 }
      ],
      dinner: [
        { name: "Sweet Potato & Black Bean Bowl", calories: 600, protein_g: 16, carbs_g: 80, fats_g: 14 },
        { name: "Grilled Salmon with Asparagus", calories: 650, protein_g: 42, carbs_g: 10, fats_g: 30 },
        { name: "Paneer Butter Masala & Roti", calories: 680, protein_g: 22, carbs_g: 55, fats_g: 28 },
        { name: "Brown Rice with Dal & Spinach", calories: 520, protein_g: 18, carbs_g: 70, fats_g: 10 }
      ],
      snacks: [
        { name: "Mixed Nuts & Apple", calories: 200, protein_g: 5, carbs_g: 25, fats_g: 12 },
        { name: "Hummus & Carrot Sticks", calories: 150, protein_g: 6, carbs_g: 15, fats_g: 8 },
        { name: "Whey Protein Shake", calories: 180, protein_g: 25, carbs_g: 5, fats_g: 2 },
        { name: "Rice Cakes with Peanut Butter", calories: 220, protein_g: 7, carbs_g: 20, fats_g: 12 }
      ]
    };
    
    const options = mealOptions[mealType];
    let newMeal = options[Math.floor(Math.random() * options.length)];
    if (mealPlan && mealPlan.days[day] && mealPlan.days[day][mealType] && mealPlan.days[day][mealType].name === newMeal.name) {
      newMeal = options[(options.indexOf(newMeal) + 1) % options.length];
    }
    
    setMealPlan(prev => {
      if (!prev) return prev;
      const updatedDays = { ...prev.days };
      updatedDays[day] = {
        ...updatedDays[day],
        [mealType]: newMeal
      };
      return {
        ...prev,
        days: updatedDays,
        last_regenerated_at: new Date().toISOString()
      };
    });
    triggerAlert(`Swapped ${mealType} to: ${newMeal.name}! 🔄`);
  };
  
  const handleLogFood = (name, calories, protein = 25, carbs = 45, fats = 10) => {
    setUser(prev => ({ ...prev, calToday: prev.calToday + calories }));
    setNutritionDaily(prev => ({
      ...prev,
      calories_consumed: prev.calories_consumed + calories,
      protein_g: prev.protein_g + protein,
      carbs_g: prev.carbs_g + carbs,
      fats_g: prev.fats_g + fats,
      meals_logged: [...new Set([...prev.meals_logged, "snack"])]
    }));
    setRecentFoodLogs(prev => [...new Set([name, ...prev])].slice(0, 3));
    triggerAlert(`Logged ${name} (${calories} kcal)!`);
  };
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
    if (!sensorActive || expandedCarouselSlide !== 3) return;
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
    if (!sensorActive || expandedCarouselSlide !== 3) return;

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
  }, [sensorActive, expandedCarouselSlide]);

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
    let bottom = "108px"; // Home, Community & base level (clearing floating bottom nav)
    let left = "auto";
    let right = "20px";
    let width = 48;
    let height = 48;
    let borderRadius = "50%";

    if (activeOverlay === "active_workout") {
      bottom = "280px";
      right = "16px";
    } else if (activeOverlay === "nutrition" || activeOverlay === "progress") {
      bottom = "108px";
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

  // Auto-scroll Carousel every 2 seconds (paused when expanded detail sheet is open)
  useEffect(() => {
    if (expandedCarouselSlide !== null) return;
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % 5);
    }, 2000);
    return () => clearInterval(interval);
  }, [expandedCarouselSlide]);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      setCarouselIndex(prev => Math.min(prev + 1, 4));
    } else if (info.offset.x > swipeThreshold) {
      setCarouselIndex(prev => Math.max(prev - 1, 0));
    }
  };

  const renderCarouselSlide = (idx) => {
    const bgImages = {
      0: "/carousel_overview_bg.png",
      1: "/carousel_nutrition_bg.png",
      2: "/carousel_water_bg.png",
      3: "/carousel_steps_bg.png",
      4: "/carousel_energy_bg.png"
    };

    const currentBg = bgImages[idx];

    const slideWrapperStyle = {
      position: "relative",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxSizing: "border-box"
    };

    const bgOverlayStyle = {
      position: "absolute",
      top: -16,
      left: -16,
      right: -16,
      bottom: -16,
      backgroundImage: `url('${currentBg}')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      zIndex: 1
    };

    const gradientOverlayStyle = {
      position: "absolute",
      top: -16,
      left: -16,
      right: -16,
      bottom: -16,
      background: "linear-gradient(135deg, rgba(11, 16, 32, 0.85) 0%, rgba(21, 28, 50, 0.92) 100%)",
      zIndex: 2
    };

    const contentWrapperStyle = {
      position: "relative",
      zIndex: 3,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "space-between"
    };

    switch (idx) {
      case 0:
        return (
          <div style={slideWrapperStyle}>
            <div style={bgOverlayStyle} />
            <div style={gradientOverlayStyle} />
            <div style={contentWrapperStyle}>
              <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Intro Dashboard</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px", margin: "6px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Flame size={12} color="var(--color-primary)" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#FFFFFF" }}>{user.streak}d</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Droplet size={12} color="var(--color-secondary)" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#FFFFFF" }}>{user.waterToday}L</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Footprints size={12} color="var(--color-primary)" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#FFFFFF" }}>{Math.round(user.stepsToday / 100) / 10}k</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Zap size={12} color="var(--color-primary)" />
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#FFFFFF" }}>490 kcal</span>
                </div>
              </div>
              <span style={{ fontSize: 9, color: "var(--color-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>Swipe to explore details &gt;</span>
            </div>
          </div>
        );
      case 1:
        return (
          <div style={slideWrapperStyle}>
            <div style={bgOverlayStyle} />
            <div style={gradientOverlayStyle} />
            <div style={contentWrapperStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Calories & Macros</div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: "#FFFFFF", marginTop: 2 }}>
                    {nutritionDaily.calories_consumed} <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>/ {nutritionDaily.calorie_target} kcal</span>
                  </div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <ChefHat size={14} color="var(--color-primary)" />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ProgressRing value={(nutritionDaily.calories_consumed / nutritionDaily.calorie_target) * 100} size={28} strokeWidth={3} showLabel={false} color="var(--color-primary)" />
                <div style={{ display: "flex", gap: 6, fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>
                  <span>P: {nutritionDaily.protein_g}g</span>
                  <span>•</span>
                  <span>C: {nutritionDaily.carbs_g}g</span>
                  <span>•</span>
                  <span>F: {nutritionDaily.fats_g}g</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div style={slideWrapperStyle}>
            <div style={bgOverlayStyle} />
            <div style={gradientOverlayStyle} />
            <div style={contentWrapperStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Water Intake</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#FFFFFF", marginTop: 2 }}>{user.waterToday}L <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>/ {user.waterGoal}L</span></div>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setReminderActive(!reminderActive);
                    triggerAlert(!reminderActive ? "Water reminder set! 🔔" : "Water reminder disabled! 🔔");
                  }}
                  style={{ 
                    width: 28, height: 28, borderRadius: "50%", 
                    backgroundColor: reminderActive ? "rgba(91, 140, 255, 0.2)" : "rgba(255, 255, 255, 0.08)", 
                    display: "flex", alignItems: "center", justifyContent: "center", border: reminderActive ? "1px solid rgba(91, 140, 255, 0.4)" : "none", cursor: "pointer" 
                  }}
                >
                  <Bell size={14} color={reminderActive ? C.blue : "rgba(255,255,255,0.6)"} fill={reminderActive ? C.blue : "none"} />
                </motion.button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <ProgressRing value={(user.waterToday / user.waterGoal) * 100} size={28} strokeWidth={3} showLabel={false} color={C.blue} />
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Target: {Math.round((user.waterToday / user.waterGoal) * 100)}% done</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div style={slideWrapperStyle}>
            <div style={bgOverlayStyle} />
            <div style={gradientOverlayStyle} />
            <div style={contentWrapperStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Steps Tracker</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#FFFFFF", marginTop: 2 }}>{user.stepsToday.toLocaleString()}</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <Footprints size={14} color="var(--color-primary)" />
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 36, paddingBottom: 4 }}>
                {[30, 45, 25, 60, 80, 50, 40].map((h, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      flex: 1, 
                      height: `${h}%`, 
                      backgroundColor: i === 4 ? "var(--color-primary)" : "rgba(255,255,255,0.25)", 
                      borderRadius: 1 
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div style={slideWrapperStyle}>
            <div style={bgOverlayStyle} />
            <div style={gradientOverlayStyle} />
            <div style={contentWrapperStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>Calories Burned</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#FFFFFF", marginTop: 2 }}>490 kcal</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <Zap size={14} color="var(--color-primary)" />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>Walk: 170 kcal &bull; Work: 320 kcal</span>
                <div style={{ width: 24, height: 24, borderRadius: "50%", border: `3.5px solid var(--color-primary)`, borderTopColor: "transparent", transform: "rotate(45deg)" }} />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // ── Onboarding step data ──
  const onboardingSteps = [
    { icon: <Dumbbell size={36} color={color.primary} />, title: "Personalised Workouts", desc: "AI-powered routines tailored to your body, goals, and recovery." },
    { icon: <Salad size={36} color={color.primary} />, title: "Smart Nutrition", desc: "Scan meals, track macros, and get real-time diet coaching from Rex." },
    { icon: <Brain size={36} color={color.secondary} />, title: "Mind & Recovery", desc: "Yoga, skincare, mood check-ins — your holistic wellness companion." },
    { icon: <Target size={36} color={color.primary} />, title: "Compete & Progress", desc: "Track streaks, climb leaderboards, and unlock achievements daily." },
  ];

  return (
    <div className={`main-wrapper theme-${appTheme}`}>
      <style>{`
        :root {
          /* Default: Light Theme */
          --color-bg: #F0F4F8;
          --color-surface: #FFFFFF;
          --color-surface-raised: #E5ECF4;
          --color-border: rgba(21, 28, 50, 0.08);
          --color-text1: #151C32;
          --color-text2: #5A738E;
          --color-text3: #8CA0BA;
          --color-primary: #00E5A8; /* Teal */
          --color-secondary: #5B8CFF; /* Blue */
          --color-warning: #5B8CFF;
          --color-error: #FF5C5C;
          
          --shadow-extruded: 6px 6px 14px rgba(163, 177, 198, 0.65), -6px -6px 14px rgba(255, 255, 255, 1.0);
          --shadow-recessed: inset 3px 3px 6px rgba(163, 177, 198, 0.45), inset -3px -3px 6px rgba(255, 255, 255, 0.85);
          --shadow-button: 4px 4px 10px rgba(163, 177, 198, 0.55), -4px -4px 10px rgba(255, 255, 255, 1.0);
          --shadow-button-accent: 4px 4px 10px rgba(91, 140, 255, 0.2);
          --shadow-button-danger: 4px 4px 10px rgba(255, 92, 92, 0.2);

          --badge-primary-bg: rgba(0, 229, 168, 0.08);
          --badge-primary-border: rgba(0, 229, 168, 0.15);
          --badge-secondary-bg: rgba(91, 140, 255, 0.08);
          --badge-secondary-border: rgba(91, 140, 255, 0.15);
          --badge-warning-bg: rgba(91, 140, 255, 0.08);
          --badge-warning-border: rgba(91, 140, 255, 0.15);
          --badge-error-bg: rgba(255, 92, 92, 0.08);
          --badge-error-border: rgba(255, 92, 92, 0.15);
          --badge-neutral-bg: rgba(21, 28, 50, 0.05);
          --badge-neutral-border: rgba(21, 28, 50, 0.1);
        }

        .theme-dark {
          /* Cyber-Neumorphic Dark Theme */
          --color-bg: #0B1020; /* Dark Navy first background */
          --color-surface: #151C32; /* Dark Navy surface */
          --color-surface-raised: #1A233D;
          --color-border: rgba(0, 0, 0, 0.25);
          --color-text1: #E4E4E7;
          --color-text2: #71717A;
          --color-text3: #52525B;
          --color-primary: #00E5A8; /* Teal */
          --color-secondary: #5B8CFF; /* Blue */
          --color-warning: #5B8CFF;
          --color-error: #FF5C5C;
          
          --shadow-extruded: 6px 6px 14px rgba(0, 0, 0, 0.55), -6px -6px 14px rgba(0, 0, 0, 0.0);
          --shadow-recessed: inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -3px -3px 6px rgba(0, 0, 0, 0.0);
          --shadow-button: 4px 4px 10px rgba(0, 0, 0, 0.5), -4px -4px 10px rgba(0, 0, 0, 0.0);
          --shadow-button-accent: 4px 4px 10px rgba(0, 229, 168, 0.08);
          --shadow-button-danger: 4px 4px 10px rgba(255, 92, 92, 0.08);

          --badge-primary-bg: rgba(0, 229, 168, 0.1);
          --badge-primary-border: rgba(0, 229, 168, 0.2);
          --badge-secondary-bg: rgba(91, 140, 255, 0.1);
          --badge-secondary-border: rgba(91, 140, 255, 0.2);
          --badge-warning-bg: rgba(91, 140, 255, 0.1);
          --badge-warning-border: rgba(91, 140, 255, 0.2);
          --badge-error-bg: rgba(255, 92, 92, 0.1);
          --badge-error-border: rgba(255, 92, 92, 0.2);
          --badge-neutral-bg: rgba(255, 255, 255, 0.05);
          --badge-neutral-border: rgba(255, 255, 255, 0.1);
        }

        html, body, #root {
          background-color: var(--color-bg);
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
        [data-zone="workout"]     { --zone-accent: ${color.primary}; }
        [data-zone="yoga"]        { --zone-accent: ${color.secondary}; }
        [data-zone="skincare"]    { --zone-accent: ${color.warning}; }
        [data-zone="mood"]        { --zone-accent: ${color.primary}; }
        [data-zone="leaderboard"] { --zone-accent: ${color.text2}; }
        [data-zone="supplements"] { --zone-accent: ${color.secondary}; }

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
          background-color: ${C.text1};
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
            border: 8px solid ${C.text1};
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
          background-color: ${C.surface};
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 36px;
          display: flex;
          justify-content: space-around;
          align-items: center;
          z-index: 99;
          box-sizing: border-box;
          box-shadow: var(--shadow-extruded);
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

        .text-input, input[type="number"], input[type="text"], textarea, select {
          width: 100%;
          padding: 12px 16px;
          border-radius: 16px !important;
          border: 1px solid rgba(255, 255, 255, 0.5) !important;
          background-color: ${C.surfaceLight} !important;
          font-size: 14px;
          color: ${C.text1} !important;
          outline: none;
          box-sizing: border-box;
          box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.45), inset -3px -3px 6px rgba(255, 255, 255, 0.85) !important;
          transition: all 0.2s ease;
        }

        .btn-action {
          background-color: ${C.surface};
          color: ${color.primary};
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 30px;
          padding: 12px 24px;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 4px 4px 10px rgba(163, 177, 198, 0.55), -4px -4px 10px rgba(255, 255, 255, 1.0);
          width: 100%;
          transition: all 0.2s ease;
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

                {/* Static Streak Card (Single-Focus Hero Pattern) */}
                <Card 
                  padding="16px" 
                  style={{ 
                    marginBottom: 20, 
                    border: `1.5px solid var(--color-border)`,
                    background: "var(--color-surface)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 800, color: C.text2, textTransform: "uppercase", letterSpacing: "0.5px" }}>Current Streak</div>
                      <div style={{ fontSize: 24, fontWeight: 900, color: C.text1, marginTop: 4 }}>{user.streak} Days</div>
                    </div>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "var(--badge-primary-bg)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--badge-primary-border)" }}>
                      <Flame size={18} color="var(--color-primary)" fill="var(--color-primary)" />
                    </div>
                  </div>
                  {/* Mini weekday consistency indicator */}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, color: C.text2 }}>{day}</span>
                        <div style={{
                          width: 22, height: 22, borderRadius: "50%",
                          backgroundColor: i < 5 ? "var(--color-primary)" : "transparent",
                          border: i < 5 ? "none" : `1.5px solid var(--color-border)`,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {i < 5 ? (
                            <Check size={12} strokeWidth={4} color="var(--color-bg)" />
                          ) : (
                            <span style={{ fontSize: 9, color: C.text3, fontWeight: "700" }}>{day[0]}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Train Today Section */}
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text1, marginBottom: 12 }}>Train Today</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 12, marginBottom: 20 }}>
                  {/* Workout Progress Card – 3D Tilt */}
                  <TiltCard
                    style={{ margin: 0, minHeight: 140 }}
                    padding="14px"
                    tiltStrength={10}
                    scaleOnHover={1.035}
                  >
                    {/* Full-bleed Background Image */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: "url('/lower_body_workout_thumbnail.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      zIndex: 1,
                      borderRadius: "inherit"
                    }} />
                    
                    {/* Dark Gradient Overlay for text readability */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, rgba(11,16,32,0.3) 0%, rgba(11,16,32,0.85) 100%)",
                      zIndex: 2,
                      borderRadius: "inherit"
                    }} />

                    {/* Card Content Overlay */}
                    <div style={{ zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <IconBadge icon={<Activity size={16} />} tone="primary" size={32} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>Workout</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Legs + Core &bull; 45m &bull; High</div>
                        </div>
                      </div>
                      <Button 
                        variant="secondary"
                        onClick={() => setActiveOverlay("active_workout")}
                        style={{ padding: "8px 14px", fontSize: 12, borderRadius: 12 }}
                      >
                        TODAY'S PLAN &gt;
                      </Button>
                    </div>

                    <div style={{ zIndex: 3, marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
                      <ProgressRing 
                        value={(user.setsCompleted / user.setsTotal) * 100} 
                        size={48} 
                        strokeWidth={4} 
                        label={`${user.setsCompleted}/${user.setsTotal}`} 
                        textColor="#FFFFFF"
                      />
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF" }}>{user.setsCompleted} of {user.setsTotal} sets</div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Workout progress</div>
                      </div>
                    </div>
                  </TiltCard>

                  {/* Side Recovery Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Yoga */}
                    <Card 
                      onClick={() => setActiveOverlay("yoga")} 
                      padding="12px" 
                      style={{ 
                        margin: 0, 
                        flex: 1, 
                        position: "relative", 
                        overflow: "hidden", 
                        minHeight: 85,
                        display: "flex", 
                        flexDirection: "column", 
                        justifyContent: "space-between",
                        boxSizing: "border-box" 
                      }}
                    >
                      {/* Full-bleed Background Image */}
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: "url('/yoga_recovery_thumbnail.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 1
                      }} />
                      
                      {/* Dark Gradient Overlay for text readability */}
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, rgba(11,16,32,0.3) 0%, rgba(11,16,32,0.85) 100%)",
                        zIndex: 2
                      }} />

                      {/* Card Content Overlay */}
                      <div style={{ zIndex: 3, display: "flex", alignItems: "center", gap: 6 }}>
                        <IconBadge icon={<Plus size={12} />} tone="primary" size={20} />
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF" }}>Yoga</div>
                          <div style={{ fontSize: 8, color: "var(--color-primary)", fontWeight: 700, marginTop: 1 }}>RECOVERY</div>
                        </div>
                      </div>
                    </Card>

                    {/* Nutrition Card */}
                    <Card 
                      onClick={() => {
                        setActiveOverlay("nutrition_zone");
                        setNutritionTab("analyser");
                      }} 
                      padding="12px" 
                      style={{ 
                        margin: 0, 
                        flex: 1, 
                        display: "flex", 
                        flexDirection: "column", 
                        justifyContent: "space-between",
                        minHeight: 85,
                        boxSizing: "border-box",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {/* Full-bleed Background Image */}
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage: "url('/carousel_nutrition_bg.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 1
                      }} />
                      
                      {/* Dark Gradient Overlay for text readability */}
                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, rgba(11,16,32,0.3) 0%, rgba(11,16,32,0.85) 100%)",
                        zIndex: 2
                      }} />

                      {/* Card Content Overlay */}
                      <div style={{ zIndex: 3, display: "flex", alignItems: "center", gap: 6 }}>
                        <IconBadge icon={<ChefHat size={12} />} tone="secondary" size={20} />
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF" }}>Nutrition</div>
                          <div style={{ fontSize: 8, color: "var(--color-secondary)", fontWeight: 700, marginTop: 1 }}>
                            {nutritionDaily.meals_logged.length} MEALS LOGGED
                          </div>
                        </div>
                      </div>
                      <div style={{ zIndex: 3, display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: 4 }}>
                        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>Log today's meals</span>
                        <Plus size={12} color="var(--color-secondary)" />
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Daily Metrics Carousel (Swipeable below the fold) */}
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text1, marginBottom: 12, marginTop: 24 }}>Daily Metrics</h3>
                <div 
                  className="card-light" 
                  style={{ 
                    padding: 16, margin: "0 0 20px", display: "flex", flexDirection: "column", 
                    justifyContent: "space-between", height: 160, overflow: "hidden", 
                    position: "relative", cursor: "pointer", border: `1.5px solid ${C.border}` 
                  }}
                  onClick={() => {
                    if (carouselIndex === 1) {
                      setActiveOverlay("nutrition_zone");
                    } else {
                      setExpandedCarouselSlide(carouselIndex === 0 ? 0 : carouselIndex);
                    }
                  }}
                >
                  <div style={{ flex: 1, position: "relative" }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={carouselIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        style={{ height: "100%", width: "100%" }}
                      >
                        {renderCarouselSlide(carouselIndex)}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Dot Indicators */}
                  <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 4 }}>
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <div 
                        key={idx}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCarouselIndex(idx);
                        }}
                        style={{
                          width: 6, height: 6, borderRadius: "50%",
                          backgroundColor: carouselIndex === idx ? C.accent : "rgba(255,255,255,0.2)",
                          transition: "background-color 0.2s",
                          cursor: "pointer"
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Community & Health section lists */}
                <h3 style={{ fontSize: 15, fontWeight: 800, color: C.text1, marginBottom: 12 }}>Community & Health</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {SHOW_LEADERBOARD && (
                    <Card onClick={() => setTab("leaderboard")} padding="12px 14px" style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <IconBadge icon={<Trophy size={14} />} tone="primary" size={28} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Leaderboard</span>
                      </div>
                      <span style={{ fontSize: 10, color: color.primary, fontWeight: 700 }}>RANK #24</span>
                    </Card>
                  )}

                  <Card onClick={() => setActiveOverlay("supplements")} padding="12px 14px" style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <IconBadge icon={<ShoppingBag size={14} />} tone="secondary" size={28} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Supplements</span>
                    </div>
                    <span style={{ fontSize: 10, color: color.secondary, fontWeight: 700 }}>STOCKED</span>
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
                        backgroundColor: C.surfaceLight,
                        borderRadius: 24,
                        padding: "20px 16px 16px",
                        position: "relative",
                        overflow: "hidden",
                        color: C.text1,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: 180,
                        boxShadow: C.shadow,
                        border: "1px solid rgba(255, 255, 255, 0.75)"
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
                        <img src="/lower_body_workout_thumbnail.png" alt="Lower Body Workout" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "16px", margin: 0 }} />
                      </div>
                    </div>

                    {/* Card 2: Upper Body Workout */}
                    <div 
                      onClick={() => triggerAlert("Upper body workout starts in Pro upgrade!")}
                      style={{
                        backgroundColor: appTheme === "dark" ? "rgba(157, 78, 221, 0.22)" : "rgba(229, 152, 155, 0.22)",
                        borderRadius: 24,
                        padding: "20px 16px 16px",
                        position: "relative",
                        overflow: "hidden",
                        color: C.text1,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: 180,
                        boxShadow: C.shadow,
                        border: "1px solid rgba(255, 255, 255, 0.75)"
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
                        <img src="/upper_body_workout_thumbnail.png" alt="Upper Body Workout" style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "16px", margin: 0 }} />
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

                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  minHeight: "55vh",
                  textAlign: "center"
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%",
                    backgroundColor: "rgba(0, 168, 107, 0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16
                  }}>
                    <Users size={32} color={C.accent} />
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text1, margin: "0 0 8px" }}>yet to come</h2>
                  <p style={{ fontSize: 12, color: C.text2, margin: 0, maxWidth: 220, lineHeight: 1.5 }}>
                    Community posts feed and interactive challenges are coming in a future update!
                  </p>
                </div>
              </motion.div>
            )}

            {/* 3.5. LEADERBOARD TAB */}
            {tab === "leaderboard" && !activeOverlay && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={SPRING}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h1 className="header-title" style={{ color: C.text1, margin: 0 }}>Leaderboard</h1>
                  <span style={{ fontSize: 11, fontWeight: 800, color: C.accent, backgroundColor: "rgba(0, 168, 107, 0.08)", padding: "4px 10px", borderRadius: 8 }}>Global</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { rank: 1, user: "FitRaj_21", score: "45 days streak" },
                    { rank: 2, user: "GymQueen", score: "38 days streak" },
                    { rank: 3, user: "IronMike", score: "32 days streak" },
                    { rank: 4, user: "FlexMaster", score: "29 days streak" },
                    { rank: 5, user: "CardioKing", score: "25 days streak" }
                  ].map((leader) => {
                    const initials = leader.user.substring(0, 2).toUpperCase();
                    const rankColor = leader.rank === 1 ? "#FFD700" : leader.rank === 2 ? "#C0C0C0" : leader.rank === 3 ? "#CD7F32" : C.text2;
                    return (
                      <Card key={leader.rank} padding="14px" style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${C.border}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 14, fontWeight: 900, color: rankColor, width: 20, textAlign: "center" }}>
                            {leader.rank}
                          </span>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: C.surfaceLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, border: `1px solid ${C.border}`, color: C.text1 }}>
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.text1 }}>{leader.user}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: C.text2 }}>{leader.score}</span>
                      </Card>
                    );
                  })}

                  {/* Spacer and current user rank (Rank 24) */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "10px 0" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.text3, margin: "0 3px" }} />
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.text3, margin: "0 3px" }} />
                    <div style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: C.text3, margin: "0 3px" }} />
                  </div>

                  <Card padding="14px" style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "space-between", border: `1.5px solid ${C.accent}`, boxShadow: `0 0 16px rgba(0, 168, 107, 0.15)` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 900, color: C.accent, width: 20, textAlign: "center" }}>
                        24
                      </span>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "rgba(0, 168, 107, 0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, border: `1px solid ${C.accent}`, color: C.accent }}>
                        AR
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 800, color: C.text1 }}>{user.name}</div>
                          <span style={{ fontSize: 9, fontWeight: 700, color: C.accent, backgroundColor: "rgba(0, 168, 107, 0.08)", padding: "2px 6px", borderRadius: 4 }}>YOU</span>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.accent }}>{user.streak} days streak</span>
                  </Card>
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

                  {/* Apple-style Toggle Switch */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 11, fontWeight: "800", color: C.text2, letterSpacing: "0.5px" }}>PROFILE THEME</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.35)" : C.text1, transition: "color 0.3s" }}>Light</span>
                      {/* iOS Switch Track */}
                      <div
                        onClick={() => setAppTheme(isDark ? "light" : "dark")}
                        style={{
                          width: 51,
                          height: 31,
                          borderRadius: 999,
                          backgroundColor: isDark ? "#00E5A8" : "rgba(120,120,128,0.24)",
                          position: "relative",
                          cursor: "pointer",
                          transition: "background-color 0.3s cubic-bezier(0.4,0,0.2,1)",
                          flexShrink: 0,
                          boxShadow: isDark ? "0 0 0 0 transparent" : "inset 0 0 0 1px rgba(0,0,0,0.1)",
                        }}
                      >
                        {/* Animated Thumb */}
                        <motion.div
                          layout
                          transition={{ type: "spring", stiffness: 500, damping: 38, mass: 0.8 }}
                          style={{
                            position: "absolute",
                            top: 2,
                            left: isDark ? 22 : 2,
                            width: 27,
                            height: 27,
                            borderRadius: "50%",
                            backgroundColor: "#FFFFFF",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.28), 0 1px 2px rgba(0,0,0,0.14)",
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: isDark ? C.text1 : "rgba(0,0,0,0.3)", transition: "color 0.3s" }}>Dark</span>
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

            {/* Expanded Carousel Slide 1: Overview */}
            <Sheet
              isOpen={expandedCarouselSlide === 0}
              onClose={() => setExpandedCarouselSlide(null)}
              title="Overview Analytics"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "10px 0" }}>
                <div className="card-light" style={{ display: "flex", gap: 10, padding: 14, margin: 0, border: `1.5px solid ${color.primary}` }}>
                  <Sparkles size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <p style={{ fontSize: 12, color: C.text1, margin: 0, lineHeight: 1.5 }}>
                    Hello Arjun, here is your fitness overview. Swipe the carousel dashboard or tap shortcut metrics to check daily goals!
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Card onClick={() => { setExpandedCarouselSlide(1); }} padding="14px" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Flame size={20} color="var(--color-primary)" fill="var(--color-primary)" />
                    <span style={{ fontSize: 11, color: C.text2, marginTop: 6 }}>Streak</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: C.text1, marginTop: 2 }}>{user.streak} Days</span>
                  </Card>

                  <Card onClick={() => { setCarouselIndex(1); setExpandedCarouselSlide(2); }} padding="14px" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Droplet size={20} color="var(--color-secondary)" fill="var(--color-secondary)" />
                    <span style={{ fontSize: 11, color: C.text2, marginTop: 6 }}>Water Log</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: C.text1, marginTop: 2 }}>{user.waterToday}L / {user.waterGoal}L</span>
                  </Card>

                  <Card onClick={() => { setCarouselIndex(2); setExpandedCarouselSlide(3); }} padding="14px" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Footprints size={20} color="var(--color-primary)" />
                    <span style={{ fontSize: 11, color: C.text2, marginTop: 6 }}>Steps</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: C.text1, marginTop: 2 }}>{user.stepsToday.toLocaleString()}</span>
                  </Card>

                  <Card onClick={() => { setCarouselIndex(3); setExpandedCarouselSlide(4); }} padding="14px" style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Zap size={20} color="var(--color-primary)" />
                    <span style={{ fontSize: 11, color: C.text2, marginTop: 6 }}>Energy Balance</span>
                    <span style={{ fontSize: 16, fontWeight: 900, color: C.text1, marginTop: 2 }}>490 kcal</span>
                  </Card>
                </div>

                <div className="card-light" style={{ padding: 16, margin: 0, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: C.text1 }}>Today's Performance Target</div>
                  <div style={{ fontSize: 10, color: C.text2, marginTop: 4 }}>You have completed 72% of your target workouts!</div>
                  <div style={{ width: "100%", height: 8, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 4, marginTop: 12, overflow: "hidden" }}>
                    <div style={{ width: "72%", height: "100%", backgroundColor: C.accent, borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            </Sheet>

            {/* Expanded Carousel Slide 2: Streak */}
            <Sheet
              isOpen={expandedCarouselSlide === 1}
              onClose={() => setExpandedCarouselSlide(null)}
              title="Streak Analytics"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, backgroundColor: C.surfaceLight, padding: 18, borderRadius: 16 }}>
                  <div style={{ width: 54, height: 54, borderRadius: "50%", backgroundColor: "rgba(255, 95, 31, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Flame size={32} color={C.accentOrange} fill={C.accentOrange} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: C.text1, margin: 0 }}>{user.streak} Days Streak</h3>
                    <p style={{ fontSize: 11, color: C.text2, margin: "4px 0 0" }}>Keep going! You're in the top 5% of active users.</p>
                  </div>
                </div>

                {/* Weekday indicators */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 800, color: C.text2, textTransform: "uppercase" }}>Weekly History</h4>
                  <div style={{ display: "flex", justifyContent: "space-between", backgroundColor: C.surfaceLight, padding: 14, borderRadius: 14 }}>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: C.text2 }}>{day}</span>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          backgroundColor: i < 5 ? color.primary : "transparent",
                          border: i < 5 ? "none" : `1.5px solid ${C.border}`,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          {i < 5 ? (
                            <Check size={14} strokeWidth={3} color="white" />
                          ) : (
                            <span style={{ fontSize: 9, color: C.text2 }}>{day[0]}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Streak consistency graph */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: C.text2, textTransform: "uppercase" }}>Streak Consistency</h3>
                  <div style={{ padding: 14, backgroundColor: C.surfaceLight, borderRadius: 14 }}>
                    <svg viewBox="0 0 300 100" style={{ width: "100%", height: "auto" }}>
                      <defs>
                        <linearGradient id="streakGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={C.accentOrange} stopOpacity="0.4" />
                          <stop offset="100%" stopColor={C.accentOrange} stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <line x1="10" y1="20" x2="290" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                      <line x1="10" y1="50" x2="290" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                      <line x1="10" y1="80" x2="290" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
                      <path d="M 10 90 L 50 30 L 100 50 L 150 20 L 200 40 L 250 15 L 290 85 L 290 90 Z" fill="url(#streakGrad)" />
                      <path d="M 10 90 L 50 30 L 100 50 L 150 20 L 200 40 L 250 15 L 290 85" fill="none" stroke={C.accentOrange} strokeWidth="3" strokeLinecap="round" />
                      <circle cx="10" cy="90" r="4" fill={C.accentOrange} />
                      <circle cx="50" cy="30" r="4" fill={C.accentOrange} />
                      <circle cx="100" cy="50" r="4" fill={C.accentOrange} />
                      <circle cx="150" cy="20" r="4" fill={C.accentOrange} />
                      <circle cx="200" cy="40" r="4" fill={C.accentOrange} />
                      <circle cx="250" cy="15" r="4" fill={C.accentOrange} />
                      <circle cx="290" cy="85" r="4" fill={C.accentOrange} />
                    </svg>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: C.text2, marginTop: 8, padding: "0 4px" }}>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>
            </Sheet>

            {/* Expanded Carousel Slide 3: Water */}
            <Sheet
              isOpen={expandedCarouselSlide === 2}
              onClose={() => setExpandedCarouselSlide(null)}
              title="Hydration Analytics"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.surfaceLight, padding: 18, borderRadius: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.blue, textTransform: "uppercase" }}>Hydration Target</span>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: C.text1, margin: "4px 0 0" }}>{user.waterToday}L <span style={{ fontSize: 14, color: C.text2, fontWeight: 500 }}>/ {user.waterGoal}L</span></h3>
                  </div>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setReminderActive(!reminderActive);
                      triggerAlert(!reminderActive ? "Water reminder set! 🔔" : "Water reminder disabled! 🔔");
                    }}
                    style={{ 
                      width: 44, height: 44, borderRadius: "50%", 
                      backgroundColor: reminderActive ? "rgba(0, 122, 255, 0.2)" : "rgba(255, 255, 255, 0.05)", 
                      display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" 
                    }}
                  >
                    <Bell size={20} color={reminderActive ? C.blue : C.text2} fill={reminderActive ? C.blue : "none"} />
                  </motion.button>
                </div>

                {/* Target adjustment & logging steppers */}
                <div className="card-light" style={{ padding: 16, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Adjust Target Limit:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                          width: 80, padding: "8px 12px", border: `1px solid ${C.border}`,
                          borderRadius: 10, outline: "none", fontSize: 13, fontWeight: 700,
                          backgroundColor: C.surfaceLight, textAlign: "center", color: C.text1
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 700 }}>Liters</span>
                    </div>
                  </div>

                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text1, display: "block", marginBottom: 10 }}>Quick Log Hydration:</span>
                    <div style={{ display: "flex", gap: 10 }}>
                      {[
                        { label: "+250ml", amount: 0.25 },
                        { label: "+500ml", amount: 0.5 },
                        { label: "+1.0L", amount: 1.0 }
                      ].map((item, idx) => (
                        <Button 
                          key={idx}
                          onClick={() => {
                            setUser(prev => ({ ...prev, waterToday: parseFloat((prev.waterToday + item.amount).toFixed(2)) }));
                            const logTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            setWaterLogs(prev => [...prev, { time: logTime, amount: item.amount }]);
                            triggerAlert(`Logged ${item.label} water! 💧`);
                          }}
                          variant="secondary"
                          fullWidth
                          style={{ padding: "10px 0", fontSize: 12 }}
                        >
                          {item.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hydration history bar chart */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: C.text2, textTransform: "uppercase" }}>Hydration History</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 120, backgroundColor: C.surfaceLight, borderRadius: 14, padding: "14px 20px" }}>
                    {waterLogs.map((log, idx) => {
                      const pct = Math.min((log.amount / 1.0) * 100, 100);
                      return (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: C.blue }}>{log.amount}L</span>
                          <div style={{ width: 14, height: 60, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 7, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                            <div style={{ width: "100%", height: `${pct}%`, backgroundColor: C.blue, borderRadius: 7 }} />
                          </div>
                          <span style={{ fontSize: 9, color: C.text2 }}>{log.time.split(" ")[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Sheet>

            {/* Expanded Carousel Slide 4: Steps */}
            <Sheet
              isOpen={expandedCarouselSlide === 3}
              onClose={() => setExpandedCarouselSlide(null)}
              title="Steps Analytics"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 0" }} onMouseMove={handleMouseMove}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.surfaceLight, padding: 18, borderRadius: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: C.accent, textTransform: "uppercase" }}>Steps Walked Today</span>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: C.text1, margin: "4px 0 0" }}>{user.stepsToday.toLocaleString()} <span style={{ fontSize: 14, color: C.text2, fontWeight: 500 }}>/ {stepsGoalInput}</span></h3>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "rgba(0, 229, 168, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Footprints size={24} color={C.accent} />
                  </div>
                </div>

                {/* Steps goal adjustment & simulator */}
                <div className="card-light" style={{ padding: 16, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Target Limit:</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input 
                        type="number" 
                        value={stepsGoalInput}
                        onChange={(e) => {
                          setStepsGoalInput(e.target.value);
                          const val = parseInt(e.target.value);
                          if (val > 0) setUser(prev => ({ ...prev, stepsGoalInput: val }));
                        }}
                        style={{
                          width: 90, padding: "8px 12px", border: `1px solid ${C.border}`,
                          borderRadius: 10, outline: "none", fontSize: 13, fontWeight: 700,
                          backgroundColor: C.surfaceLight, textAlign: "center", color: C.text1
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>Desktop Testing Walk Simulator:</span>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <span style={{ fontSize: 10, color: C.text2, flex: 1 }}>Move cursor over this sheet to walk. Toggle active to auto-walk.</span>
                      <Button 
                        onClick={() => {
                          setSensorActive(!sensorActive);
                          triggerAlert(!sensorActive ? "Steps sensor active! Mouse swipe or shake device to walk." : "Steps sensor paused!");
                        }}
                        variant={sensorActive ? "primary" : "secondary"}
                        style={{ padding: "8px 16px", fontSize: 12, borderRadius: 10 }}
                      >
                        {sensorActive ? "PAUSE" : "ACTIVATE"}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Steps breakdown bar chart */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: C.text2, textTransform: "uppercase" }}>Steps Breakdown</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 120, backgroundColor: C.surfaceLight, borderRadius: 14, padding: "14px 20px" }}>
                    {[
                      { label: "08:00 AM", val: 1200 },
                      { label: "12:00 PM", val: 1800 },
                      { label: "04:00 PM", val: 410 },
                      { label: "08:00 PM", val: 800 }
                    ].map((log, idx) => {
                      const pct = (log.val / 2000) * 100;
                      return (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: C.accent }}>{log.val}</span>
                          <div style={{ width: 16, height: 60, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 8, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
                            <div style={{ width: "100%", height: `${pct}%`, backgroundColor: C.accent, borderRadius: 8 }} />
                          </div>
                          <span style={{ fontSize: 9, color: C.text2 }}>{log.label.split(" ")[0]}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Sheet>

            {/* Expanded Carousel Slide 5: Calories */}
            <Sheet
              isOpen={expandedCarouselSlide === 4}
              onClose={() => setExpandedCarouselSlide(null)}
              title="Energy Balance Analytics"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "10px 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: C.surfaceLight, padding: 18, borderRadius: 16 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: color.error, textTransform: "uppercase" }}>Total Energy Burned</span>
                    <h3 style={{ fontSize: 24, fontWeight: 900, color: C.text1, margin: "4px 0 0" }}>490 kcal</h3>
                  </div>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "rgba(255, 45, 85, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={24} color={color.error} />
                  </div>
                </div>

                {/* Energy balance ring graphics */}
                <div className="card-light" style={{ padding: 20, margin: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: C.text1, alignSelf: "flex-start" }}>Energy Ring Tracker</span>
                  
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "14px 0", position: "relative" }}>
                    <svg width="180" height="180" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                      {/* Outer Ring (Consumed) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255, 95, 31, 0.08)" strokeWidth="6" />
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke={color.warning} strokeWidth="6" strokeDasharray="251.3" strokeDashoffset={251.3 - (251.3 * Math.min(user.calToday / user.calGoal, 1))} strokeLinecap="round" />

                      {/* Middle Ring (Workouts Burned) */}
                      <circle cx="50" cy="50" r="28" fill="transparent" stroke="rgba(255, 45, 85, 0.08)" strokeWidth="6" />
                      <circle cx="50" cy="50" r="28" fill="transparent" stroke={color.error} strokeWidth="6" strokeDasharray="175.9" strokeDashoffset={175.9 - (175.9 * (320 / 500))} strokeLinecap="round" />

                      {/* Inner Ring (Walking Burned) */}
                      <circle cx="50" cy="50" r="16" fill="transparent" stroke="rgba(0, 229, 168, 0.08)" strokeWidth="6" />
                      <circle cx="50" cy="50" r="16" fill="transparent" stroke={color.primary} strokeWidth="6" strokeDasharray="100.5" strokeDashoffset={100.5 - (100.5 * (170 / 300))} strokeLinecap="round" />
                    </svg>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%", borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color.warning }} />
                        <span style={{ color: C.text1, fontWeight: 700 }}>Consumed</span>
                      </div>
                      <span style={{ color: C.text2 }}>{user.calToday} kcal / {user.calGoal} kcal</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color.error }} />
                        <span style={{ color: C.text1, fontWeight: 700 }}>Workout Burn</span>
                      </div>
                      <span style={{ color: C.text2 }}>320 kcal / 500 kcal</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color.primary }} />
                        <span style={{ color: C.text1, fontWeight: 700 }}>Walking Burn</span>
                      </div>
                      <span style={{ color: C.text2 }}>170 kcal / 300 kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            </Sheet>

            {/* D. NUTRITION FEATURE OVERLAY (Full App Screen Page) */}
            {activeOverlay === "nutrition_deprecated" && (() => {
              const nutritionAccent = color.secondary; /* Align to Blue AI/data zone token */
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
                                  const p = Math.round((parseInt(manualProtein) || 0) * foodMultiplier);
                                  const cb = Math.round((parseInt(manualCarbs) || 0) * foodMultiplier);
                                  handleLogFood(name, c, p || 25, cb || 45, Math.round((p || 25) * 0.2) || 8);
                                  
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
                                  const p = Math.round((scannedFoodResult.protein || 20) * foodMultiplier);
                                  const cb = Math.round((scannedFoodResult.carbs || 35) * foodMultiplier);
                                  const f = Math.round((scannedFoodResult.fats || 8) * foodMultiplier);
                                  handleLogFood(name, c, p, cb, f);
                                  
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
                    <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--badge-secondary-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "1px solid var(--badge-secondary-border)" }}>
                      <Sparkles size={14} color="var(--color-secondary)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: "800", color: "var(--color-secondary)", textTransform: "uppercase", marginBottom: 2 }}>Rex AI Companion</div>
                      <p style={{ fontSize: 11, color: C.text1, margin: 0, lineHeight: 1.4 }}>
                        "Welcome back, Arjun! Ready to conquer today's Recommended Workout? Let's keep that 12-day streak glowing!"
                      </p>
                    </div>
                  </div>

                  {/* 2. CORE METRICS ROW (Streak, Calories, Water Ring) */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    {/* Metric 1: Streak */}
                    <div className="card-light" style={{ flex: 1, margin: 0, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: `1px solid ${C.border}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--badge-primary-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, border: "1px solid var(--badge-primary-border)" }}>
                        <TrendingUp size={14} color="var(--color-primary)" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>{user.streak} Days</span>
                      <span style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>Current Streak</span>
                    </div>

                    {/* Metric 2: Calories */}
                    <div className="card-light" style={{ flex: 1, margin: 0, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: `1px solid ${C.border}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--badge-primary-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, border: "1px solid var(--badge-primary-border)" }}>
                        <ChefHat size={14} color="var(--color-primary)" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>{user.calToday} kcal</span>
                      <span style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>of {user.calGoal} Target</span>
                    </div>

                    {/* Metric 3: Water Ring */}
                    <div className="card-light" style={{ flex: 1, margin: 0, padding: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", border: `1px solid ${C.border}` }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: "var(--badge-secondary-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6, border: "1px solid var(--badge-secondary-border)" }}>
                        <ShoppingBag size={14} color="var(--color-secondary)" />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: C.text1 }}>{user.waterToday}L</span>
                      <span style={{ fontSize: 9, color: C.text2, marginTop: 2 }}>of {user.waterGoal}L Goal</span>
                    </div>
                  </div>

                  {/* ── CURRENT STREAK TRACKER ────────────────────── */}
                  <div style={{
                    background: "linear-gradient(135deg, rgba(0,229,168,0.08) 0%, rgba(91,140,255,0.06) 100%)",
                    border: `1.5px solid rgba(0,229,168,0.18)`,
                    borderRadius: 20,
                    padding: "14px 16px",
                    marginBottom: 14
                  }}>
                    {/* Header row */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 9, fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 2 }}>Current Streak</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: C.text1, lineHeight: 1 }}>{user.streak} Days</div>
                      </div>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(0,229,168,0.25) 0%, rgba(0,229,168,0.05) 100%)",
                        border: "1.5px solid rgba(0,229,168,0.35)",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}>
                        <Flame size={18} color="var(--color-primary)" />
                      </div>
                    </div>

                    {/* Day chips */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day, i) => {
                        const isActive = i < 5; // Mon-Fri active
                        const isToday = i === 4;
                        return (
                          <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                            <div style={{
                              fontSize: 9, fontWeight: 700,
                              color: isActive ? "var(--color-primary)" : C.text3,
                              letterSpacing: "0.3px"
                            }}>{day}</div>
                            <motion.div
                              initial={{ scale: 0.6, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 20 }}
                              style={{
                                width: 28, height: 28, borderRadius: "50%",
                                backgroundColor: isActive ? "var(--color-primary)" : "rgba(255,255,255,0.04)",
                                border: isActive ? "none" : `1.5px solid ${C.border}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: isActive && isToday ? "0 0 10px rgba(0,229,168,0.5)" : "none"
                              }}
                            >
                              {isActive
                                ? <Check size={13} strokeWidth={3} color="#0B1020" />
                                : <span style={{ fontSize: 9, color: C.text3, fontWeight: 700 }}>{day[0]}</span>
                              }
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── YOUR PROGRESS BAR CHART ───────────────────── */}
                  <div style={{
                    backgroundColor: C.surface,
                    border: `1.5px solid ${C.border}`,
                    borderRadius: 20,
                    padding: "16px",
                    marginBottom: 16
                  }}>
                    {/* Chart Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 16, fontWeight: 900, color: C.text1 }}>Your progress</div>
                        <div style={{ fontSize: 10, color: C.text2, marginTop: 3, maxWidth: 160, lineHeight: 1.4 }}>See how your focus changes across the week.</div>
                      </div>
                      {/* Week / Month Toggle */}
                      <div style={{
                        display: "flex", gap: 2, backgroundColor: C.bg,
                        borderRadius: 999, padding: 3, border: `1px solid ${C.border}`
                      }}>
                        {["week","month"].map(mode => (
                          <motion.button
                            key={mode}
                            onClick={() => setProgressChartMode(mode)}
                            whileTap={{ scale: 0.94 }}
                            style={{
                              padding: "5px 13px", borderRadius: 999, border: "none",
                              fontSize: 11, fontWeight: 700, cursor: "pointer",
                              backgroundColor: progressChartMode === mode ? "var(--color-primary)" : "transparent",
                              color: progressChartMode === mode ? "#0B1020" : C.text2,
                              transition: "all 0.25s"
                            }}
                          >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Capsule Bar Chart */}
                    {(() => {
                      const weekData = [
                        { label: "Mon", value: 56 },
                        { label: "Tue", value: 32 },
                        { label: "Wed", value: 68, highlight: true },
                        { label: "Thu", value: 44 },
                        { label: "Fri", value: 52 },
                        { label: "Sat", value: 20 },
                        { label: "Sun", value: 0 },
                      ];
                      const monthData = [
                        { label: "W1", value: 58 },
                        { label: "W2", value: 72, highlight: true },
                        { label: "W3", value: 45 },
                        { label: "W4", value: 63 },
                      ];
                      const data = progressChartMode === "week" ? weekData : monthData;
                      const maxVal = Math.max(...data.map(d => d.value));
                      const avgVal = Math.round(data.filter(d => d.value > 0).reduce((a, b) => a + b.value, 0) / data.filter(d => d.value > 0).length);
                      const chartH = 120;

                      return (
                        <>
                          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: chartH, gap: 6, marginBottom: 10 }}>
                            {data.map((d, i) => {
                              const barH = d.value > 0 ? Math.max((d.value / maxVal) * chartH, 18) : 18;
                              return (
                                <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                                  {/* Value label above bar */}
                                  {d.value > 0 && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                      <span style={{ fontSize: 10, fontWeight: 800, color: d.highlight ? "var(--color-primary)" : C.text2 }}>{d.value}</span>
                                      {d.highlight && <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}><TrendingUp size={8} color="#0B1020" /></div>}
                                    </div>
                                  )}

                                  {/* Capsule bar */}
                                  <motion.div
                                    initial={{ scaleY: 0 }}
                                    animate={{ scaleY: 1 }}
                                    transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 24 }}
                                    style={{
                                      width: "100%",
                                      height: barH,
                                      borderRadius: 999,
                                      background: d.highlight
                                        ? "linear-gradient(to top, rgba(0,229,168,0.3) 0%, rgba(0,229,168,0.9) 100%)"
                                        : d.value > 0
                                          ? "linear-gradient(to top, rgba(0,229,168,0.08) 0%, rgba(0,229,168,0.35) 100%)"
                                          : "rgba(255,255,255,0.04)",
                                      border: d.highlight ? "1.5px solid rgba(0,229,168,0.6)" : `1px solid ${C.border}`,
                                      transformOrigin: "bottom",
                                      position: "relative",
                                      overflow: "hidden"
                                    }}
                                  >
                                    {/* Inner lighter cap at top */}
                                    {d.value > 0 && (
                                      <div style={{
                                        position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
                                        width: "55%", height: "28%", borderRadius: 999,
                                        backgroundColor: d.highlight ? "rgba(0,229,168,0.55)" : "rgba(0,229,168,0.18)"
                                      }} />
                                    )}
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Day Labels */}
                          <div style={{ display: "flex", justifyContent: "space-around" }}>
                            {data.map(d => (
                              <div key={d.label} style={{ flex: 1, textAlign: "center", fontSize: 9, fontWeight: 700, color: d.highlight ? "var(--color-primary)" : C.text3 }}>{d.label}</div>
                            ))}
                          </div>

                          {/* Legend row */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "rgba(0,229,168,0.5)", border: "1.5px solid var(--color-primary)" }} />
                              <span style={{ fontSize: 9, color: C.text2, fontWeight: 600 }}>Minutes of focused study</span>
                            </div>
                            <span style={{ fontSize: 9, fontWeight: 800, color: C.text1 }}>Average per day: <span style={{ color: "var(--color-primary)" }}>{avgVal} min</span></span>
                          </div>
                        </>
                      );
                    })()}
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

            {/* E2. NUTRITION ZONE HOME SCREEN OVERLAY */}
            {activeOverlay === "nutrition_zone" && (() => {
              const nutritionAccent = color.secondary;
              const isNewUser = recentFoodLogs.length === 0;
              const presets = isNewUser ? ["Apple", "Oatmeal", "Greek Yogurt"] : recentFoodLogs;

              const handleScanPlateClick = () => {
                setAnalyzingFood(true);
                setScanConfidence(null);
                setScannedFoodResult(null);

                // Simulate plate scan
                setTimeout(() => {
                  setAnalyzingFood(false);
                  setScanConfidence(0.92);
                  
                  const mockResult = {
                    name: "Avocado & Chickpea Salad",
                    grade: "A",
                    calories: 340,
                    protein: 12,
                    carbohydrates: 28,
                    fat: 20,
                    fiber: 9,
                    sugar: 4,
                    sodium: 320,
                    tips: "Excellent choice! This meal is packed with healthy monounsaturated fats from avocado and complex carbohydrates from chickpeas."
                  };
                  setScannedFoodResult(mockResult);
                  triggerAlert("Rex scanned your plate! Avocado & Chickpea Salad identified. 🥑");
                }, 2000);
              };

              const handlePresetClick = (pName) => {
                let cal = 150, p = 5, c = 20, f = 4;
                if (pName === "Salad") { cal = 150; p = 5; c = 20; f = 4; }
                else if (pName === "Chicken Rice") { cal = 650; p = 45; c = 75; f = 12; }
                else if (pName === "Protein Shake") { cal = 220; p = 30; c = 8; f = 3; }
                else if (pName === "Apple") { cal = 80; p = 0; c = 22; f = 0; }
                else if (pName === "Oatmeal") { cal = 300; p = 10; c = 50; f = 5; }
                else if (pName === "Greek Yogurt") { cal = 150; p = 15; c = 10; f = 2; }
                
                handleLogFood(pName, cal, p, c, f);
              };

              return (
                <motion.div
                  key="nutrition-zone-screen"
                  initial={{ opacity: 0, y: 960 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 960 }}
                  transition={{ type: "spring", damping: 28 }}
                  style={{
                    position: "absolute", inset: 0, backgroundColor: C.appBg, zIndex: 1000,
                    display: "flex", flexDirection: "column", boxSizing: "border-box",
                    padding: "54px 20px 24px", transition: "background-color 0.3s",
                    overflowY: "auto"
                  }}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <div>
                      <h1 className="header-title" style={{ margin: 0, color: C.text1 }}>Nutrition Zone</h1>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.text2 }}>Today, July 7, 2026</span>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        border: `1px solid ${C.border}`,
                        backgroundColor: C.surface,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "var(--shadow-button)",
                      }}
                      onClick={() => setActiveOverlay(null)}
                    >
                      <X size={16} color={C.text1} />
                    </motion.button>
                  </div>

                  {/* 1. Summary Card (Momentum Ring + Target Stats) */}
                  <Card padding="20px" style={{ margin: "0 0 20px", display: "flex", gap: 20, alignItems: "center", flexShrink: 0 }}>
                    <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
                      <ProgressRing 
                        value={(nutritionDaily.calories_consumed / nutritionDaily.calorie_target) * 100} 
                        size={100} 
                        strokeWidth={10} 
                        color="var(--color-primary)" 
                        label={`${nutritionDaily.calories_consumed}`}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: C.text2, textTransform: "uppercase" }}>Calorie Progress</span>
                      <div style={{ fontSize: 20, fontWeight: 900, color: C.text1, marginTop: 2 }}>
                        {nutritionDaily.calories_consumed} <span style={{ fontSize: 13, color: C.text2, fontWeight: 500 }}>/ {nutritionDaily.calorie_target} kcal</span>
                      </div>
                      {/* Micro Macro Bars */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                        {/* Protein */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700 }}>
                            <span style={{ color: C.text1 }}>Protein</span>
                            <span style={{ color: C.text2 }}>{nutritionDaily.protein_g}g / 150g</span>
                          </div>
                          <div style={{ width: "100%", height: 6, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min((nutritionDaily.protein_g / 150) * 100, 100)}%`, height: "100%", backgroundColor: "var(--color-primary)" }} />
                          </div>
                        </div>
                        {/* Carbs */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700 }}>
                            <span style={{ color: C.text1 }}>Carbs</span>
                            <span style={{ color: C.text2 }}>{nutritionDaily.carbs_g}g / 220g</span>
                          </div>
                          <div style={{ width: "100%", height: 6, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min((nutritionDaily.carbs_g / 220) * 100, 100)}%`, height: "100%", backgroundColor: "var(--color-secondary)" }} />
                          </div>
                        </div>
                        {/* Fats */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700 }}>
                            <span style={{ color: C.text1 }}>Fats</span>
                            <span style={{ color: C.text2 }}>{nutritionDaily.fats_g}g / 70g</span>
                          </div>
                          <div style={{ width: "100%", height: 6, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min((nutritionDaily.fats_g / 70) * 100, 100)}%`, height: "100%", backgroundColor: C.text3 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* 2. Today's Meals List */}
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text1, margin: "0 0 12px" }}>Today's Meals</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {[
                      { type: "Breakfast", icon: "🍳", target: 450, logged: nutritionDaily.meals_logged.includes("breakfast") ? "Oatmeal & Banana" : null },
                      { type: "Lunch", icon: "🥗", target: 700, logged: nutritionDaily.meals_logged.includes("lunch") ? "Chicken Salad & Rice" : null },
                      { type: "Dinner", icon: "🥩", target: 600, logged: nutritionDaily.meals_logged.includes("dinner") ? "Salmon & Sweet Potato" : null },
                      { type: "Snacks", icon: "🍎", target: 250, logged: nutritionDaily.meals_logged.includes("snack") ? "Greek Yogurt & Protein Shake" : null }
                    ].map((meal, idx) => (
                      <Card 
                        key={idx} 
                        onClick={() => {
                          setNutritionTab("analyser");
                        }}
                        padding="12px 14px"
                        style={{ margin: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 18 }}>{meal.icon}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>{meal.type}</div>
                            <div style={{ fontSize: 10, color: C.text2, marginTop: 2 }}>
                              {meal.logged ? meal.logged : `Target: ${meal.target} kcal`}
                            </div>
                          </div>
                        </div>
                        {meal.logged ? (
                          <span style={{ fontSize: 10, color: "var(--color-primary)", fontWeight: 800 }}>LOGGED</span>
                        ) : (
                          <Plus size={14} color="var(--color-secondary)" />
                        )}
                      </Card>
                    ))}
                  </div>

                  {/* 3. Segmented Tab Selector */}
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text1, margin: "0 0 12px" }}>Quick Actions</h3>
                  <div style={{ display: "flex", marginBottom: 20, backgroundColor: C.surfaceLight, borderRadius: 14, padding: 4, border: `1px solid ${C.border}` }}>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNutritionTab("analyser")}
                      style={{
                        flex: 1, padding: "10px 6px", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 700,
                        backgroundColor: nutritionTab === "analyser" ? C.surface : "transparent",
                        color: nutritionTab === "analyser" ? nutritionAccent : C.text2,
                        cursor: "pointer", transition: "color 0.2s, background-color 0.2s"
                      }}
                    >
                      🔍 Analyser
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNutritionTab("creator")}
                      style={{
                        flex: 1, padding: "10px 6px", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 700,
                        backgroundColor: nutritionTab === "creator" ? C.surface : "transparent",
                        color: nutritionTab === "creator" ? nutritionAccent : C.text2,
                        cursor: "pointer", transition: "color 0.2s, background-color 0.2s"
                      }}
                    >
                      🥬 Recipe
                    </motion.button>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setNutritionTab("planner")}
                      style={{
                        flex: 1, padding: "10px 6px", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 700,
                        backgroundColor: nutritionTab === "planner" ? C.surface : "transparent",
                        color: nutritionTab === "planner" ? nutritionAccent : C.text2,
                        cursor: "pointer", transition: "color 0.2s, background-color 0.2s"
                      }}
                    >
                      📅 Planner
                    </motion.button>
                  </div>

                  {/* 4. Tab Content Panel */}
                  <div style={{ position: "relative", marginBottom: 20 }}>
                    <AnimatePresence mode="wait">
                      {/* Sub-tab 1: FOOD ANALYSER */}
                      {nutritionTab === "analyser" && (
                        <motion.div
                          key="analyser-panel"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={SPRING}
                          style={{ display: "flex", flexDirection: "column", gap: 14 }}
                        >
                          {!scannedFoodResult ? (
                            <div className="card-light" style={{ padding: 18, border: `1px solid ${C.border}`, margin: 0 }}>
                              <h3 style={{ fontSize: 14, fontWeight: 800, color: C.text1, margin: "0 0 4px" }}>Food Scanner</h3>
                              <p style={{ fontSize: 11, color: C.text2, margin: "0 0 14px" }}>Capture food items to extract dynamic macro data instantly.</p>

                              {/* Scanner visual camera box */}
                              <div 
                                className="scanner-frame" 
                                style={{ 
                                  marginBottom: 16,
                                  border: `2.5px dashed ${nutritionAccent}`
                                }} 
                                onClick={handleScanPlateClick}
                              >
                                {analyzingFood && <div className="scanning-line"></div>}
                                <Camera size={32} color={nutritionAccent} style={{ marginBottom: 8 }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: C.text1 }}>
                                  Open Camera / Scan Plate
                                </span>
                                <span style={{ fontSize: 10, color: C.text2, marginTop: 4 }}>
                                  or select from recent logs below
                                </span>
                              </div>

                              {/* Manual Input form trigger link */}
                              <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                                <span 
                                  onClick={() => setShowManualForm(!showManualForm)}
                                  style={{ fontSize: 11, color: nutritionAccent, fontWeight: 800, cursor: "pointer", textDecoration: "underline" }}
                                >
                                  {showManualForm ? "Hide Manual Form" : "✏️ Log food manually"}
                                </span>
                              </div>

                              {/* Manual food logging form panel */}
                              {showManualForm && (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                                  <input 
                                    type="text" 
                                    placeholder="Food Name (e.g. Oatmeal)"
                                    value={manualFoodName}
                                    onChange={(e) => setManualFoodName(e.target.value)}
                                    style={{ padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surfaceLight, color: C.text1, fontSize: 11 }}
                                  />
                                  <div style={{ display: "flex", gap: 10 }}>
                                    <input 
                                      type="number" 
                                      placeholder="Calories (kcal)" 
                                      value={manualCalories}
                                      onChange={(e) => setManualCalories(e.target.value)}
                                      style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surfaceLight, color: C.text1, fontSize: 11 }}
                                    />
                                    <input 
                                      type="number" 
                                      placeholder="Protein (g)" 
                                      value={manualProtein}
                                      onChange={(e) => setManualProtein(e.target.value)}
                                      style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surfaceLight, color: C.text1, fontSize: 11 }}
                                    />
                                    <input 
                                      type="number" 
                                      placeholder="Carbs (g)" 
                                      value={manualCarbs}
                                      onChange={(e) => setManualCarbs(e.target.value)}
                                      style={{ flex: 1, padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, backgroundColor: C.surfaceLight, color: C.text1, fontSize: 11 }}
                                    />
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
                                      const p = Math.round((parseInt(manualProtein) || 0) * foodMultiplier);
                                      const cb = Math.round((parseInt(manualCarbs) || 0) * foodMultiplier);
                                      handleLogFood(name, c, p || 25, cb || 45, Math.round((p || 25) * 0.2) || 8);
                                      
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
                            </div>
                          ) : (
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
                                  const p = Math.round((scannedFoodResult.protein || 20) * foodMultiplier);
                                  const cb = Math.round((scannedFoodResult.carbohydrates || 35) * foodMultiplier);
                                  const f = Math.round((scannedFoodResult.fat || 8) * foodMultiplier);
                                  handleLogFood(name, c, p, cb, f);
                                  
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

                          {/* Selected presets / Frequently Logged items list */}
                          <span style={{ fontSize: 12, fontWeight: 800, color: C.text1, marginBottom: 8, display: "block" }}>
                            Frequently Logged Presets
                          </span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                            {presets.map((pName, i) => (
                              <motion.button
                                key={i}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handlePresetClick(pName)}
                                style={{
                                  padding: "6px 12px", borderRadius: 12, border: `1px solid ${C.border}`,
                                  backgroundColor: C.surface, fontSize: 11, fontWeight: 700, color: C.text1, cursor: "pointer",
                                  boxShadow: "var(--shadow-button)"
                                }}
                              >
                                {pName}
                              </motion.button>
                            ))}
                          </div>
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
                              onClick={handleSimulateRecipeGeneration}
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
                                          {recipe.time} &bull; {recipe.calories} &bull; {recipe.protein} Protein
                                        </div>
                                      </div>
                                    </div>

                                    {/* Ingredient list */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                                      {recipe.ingredientsUsed && recipe.ingredientsUsed.map((ing, i) => (
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

                      {/* Sub-tab 3: MEAL PLANNER */}
                      {nutritionTab === "planner" && (
                        <motion.div
                          key="planner-panel"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={SPRING}
                          style={{ display: "flex", flexDirection: "column", gap: 14 }}
                        >
                          {!mealPlan ? (
                            <div className="card-light" style={{ padding: 20, textAlign: "center", border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 14, margin: 0 }}>
                              <ChefHat size={32} color={nutritionAccent} style={{ margin: "0 auto" }} />
                              <div>
                                <h3 style={{ fontSize: 15, fontWeight: 900, color: C.text1, margin: 0 }}>Generate 7-Day AI Diet Plan</h3>
                                <p style={{ fontSize: 11, color: C.text2, margin: "6px 0 0", lineHeight: 1.4 }}>
                                  Rex AI will generate a personalized weekly schedule matching your onboarding profile settings.
                                </p>
                              </div>
                              <Button 
                                variant="primary" 
                                onClick={() => {
                                  setMealPlan(generateMockPlan("vegetarian", 2000));
                                  triggerAlert("Generated a 7-Day Vegetarian Diet Plan! 🥦");
                                }}
                                style={{ padding: 14 }}
                              >
                                GENERATE MY 7-DAY PLAN
                              </Button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                              {/* Plan Summary Card */}
                              <div className="card-light" style={{ padding: 14, border: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", margin: 0 }}>
                                <div>
                                  <span style={{ fontSize: 9, fontWeight: 800, color: nutritionAccent, textTransform: "uppercase" }}>Active Weekly Plan</span>
                                  <h4 style={{ fontSize: 14, fontWeight: 900, color: C.text1, margin: "2px 0 0" }}>
                                    {mealPlan.diet_type.toUpperCase()} • {mealPlan.calorie_target} kcal/day
                                  </h4>
                                </div>
                                <Button 
                                  variant="secondary"
                                  onClick={() => {
                                    setMealPlan(generateMockPlan(mealPlan.diet_type, mealPlan.calorie_target));
                                    triggerAlert("Diet Plan Regenerated! 🔄");
                                  }}
                                  style={{ padding: "6px 12px", fontSize: 10, borderRadius: 8 }}
                                >
                                  Regenerate
                                </Button>
                              </div>

                              {/* 7-Day Day Selector */}
                              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
                                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(d => {
                                  const active = plannerActiveDay === d;
                                  return (
                                    <button
                                      key={d}
                                      onClick={() => setPlannerActiveDay(d)}
                                      style={{
                                        padding: "8px 12px",
                                        borderRadius: 10,
                                        fontSize: 11,
                                        fontWeight: 700,
                                        border: active ? `1.5px solid ${nutritionAccent}` : `1.5px solid ${C.border}`,
                                        backgroundColor: active ? "rgba(91, 140, 255, 0.08)" : "transparent",
                                        color: active ? nutritionAccent : C.text1,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap"
                                      }}
                                    >
                                      {d.charAt(0).toUpperCase() + d.slice(1, 3)}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Day's Meals */}
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {mealPlan.days[plannerActiveDay] && Object.entries(mealPlan.days[plannerActiveDay]).map(([type, meal]) => (
                                  <div 
                                    key={type} 
                                    className="card-light" 
                                    style={{ 
                                      padding: 14, 
                                      border: `1.5px solid ${C.border}`, 
                                      display: "flex", 
                                      justifyContent: "space-between", 
                                      alignItems: "center",
                                      margin: 0
                                    }}
                                  >
                                    <div>
                                      <span style={{ fontSize: 9, fontWeight: 800, color: nutritionAccent, textTransform: "uppercase" }}>{type}</span>
                                      <h5 style={{ fontSize: 12, fontWeight: 900, color: C.text1, margin: "2px 0 0" }}>{meal.name}</h5>
                                      <span style={{ fontSize: 9, color: C.text2, marginTop: 4, display: "block" }}>
                                        {meal.calories} kcal &bull; P: {meal.protein_g}g C: {meal.carbs_g}g F: {meal.fats_g}g
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleSwapMeal(plannerActiveDay, type)}
                                      style={{
                                        padding: "6px 10px",
                                        borderRadius: 8,
                                        border: `1px solid ${nutritionAccent}`,
                                        backgroundColor: "transparent",
                                        color: nutritionAccent,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        cursor: "pointer"
                                      }}
                                    >
                                      Swap meal
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })()}

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
              backgroundColor: tab === "home" && !activeOverlay ? "var(--badge-primary-bg)" : "transparent",
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
              backgroundColor: tab === "plan" ? "var(--badge-secondary-bg)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}>
              <Dumbbell size={24} color={tab === "plan" ? C.blue : C.text2} />
            </div>
          </button>



          {/* Tab 4: Community */}
          <button className="nav-item" onClick={() => { setTab("community"); setActiveOverlay(null); }} style={{ position: "relative" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              backgroundColor: tab === "community" ? "var(--badge-primary-bg)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s"
            }}>
              <Users size={24} color={tab === "community" ? C.accent : C.text2} />
            </div>
          </button>

          {/* Tab 5: Leaderboard */}
          {SHOW_LEADERBOARD && (
            <button className="nav-item" onClick={() => { setTab("leaderboard"); setActiveOverlay(null); }} style={{ position: "relative" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                backgroundColor: tab === "leaderboard" ? "var(--badge-primary-bg)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s"
              }}>
                <Trophy size={24} color={tab === "leaderboard" ? C.accent : C.text2} />
              </div>
            </button>
          )}

          {/* Tab 6: Profile */}
          <button className="nav-item" onClick={() => { setTab("profile"); setActiveOverlay(null); }} style={{ position: "relative" }}>
            <div style={{
              width: 48, height: 48, borderRadius: "50%",
              backgroundColor: tab === "profile" ? "var(--badge-primary-bg)" : "transparent",
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
