import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, RotateCcw, Home, Moon, Sun, Grid3X3, Maximize2, HelpCircle, CheckCircle, AlertCircle, BarChart3, Award, TrendingUp, Mic, Send, Lightbulb } from 'lucide-react';

const ExamPrepApp = () => {
  // Main Navigation State
  const [screen, setScreen] = useState('mainMenu');
  const [darkMode, setDarkMode] = useState(false);
  
  // MCQ Test States
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [questionCount, setQuestionCount] = useState(50);
  const [timeLimit, setTimeLimit] = useState('');
  const [testActive, setTestActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testQuestions, setTestQuestions] = useState([]);

  // Interview States
  const [interviewCurrentQuestion, setInterviewCurrentQuestion] = useState(null);
  const [interviewUserAnswer, setInterviewUserAnswer] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewIsLoading, setInterviewIsLoading] = useState(false);
  const [interviewQuestionCount, setInterviewQuestionCount] = useState(0);
  const [interviewSelectedSubject, setInterviewSelectedSubject] = useState('');
  const [interviewResponses, setInterviewResponses] = useState([]);
  const messagesEndRef = useRef(null);

  // Exam Config
  const examConfig = {
    'SSC CGL': ['General Awareness', 'Reasoning', 'Quantitative Aptitude', 'English'],
    'SSC CHSL': ['General Awareness', 'Reasoning', 'Quantitative Aptitude', 'English'],
    'SSC MTS': ['General Awareness', 'Reasoning', 'Quantitative Aptitude', 'English'],
    'UPSSSC PET': ['General Knowledge', 'Reasoning', 'Quantitative Aptitude'],
    'UPSC': ['Indian Polity', 'Economics', 'History', 'Geography', 'General Science'],
    'NDA': ['Mathematics', 'General Ability', 'English'],
    'JEE': ['Physics', 'Chemistry', 'Mathematics'],
    'NEET': ['Physics', 'Chemistry', 'Biology'],
    'DEI BSc': ['Physics', 'Chemistry', 'Mathematics', 'Biology'],
  };

  const interviewSubjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology'];
  const questionTypes = [
    'Introduction & Background',
    'Subject Interest',
    'Career Goals',
    'Academic Strengths',
    'Personality & Communication',
    'Problem Solving',
    'General Aptitude'
  ];

  const exams = Object.keys(examConfig);
  const [selectedExam, setSelectedExam] = useState(exams[0] || 'SSC CGL');

  // Auto-scroll effect for interview
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interviewCurrentQuestion, interviewFeedback]);

  // Timer Effect for MCQ
  useEffect(() => {
    if (!testActive) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTestActive(false);
          setScreen('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [testActive]);

  // Format Time
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Question Generator for MCQ
  const generateQuestions = (subject) => {
    const questions = {
      'Physics': [
        { text: 'What is the SI unit of velocity?', options: ['m/s', 'cm/s', 'km/h', 'm²/s'], correct: 0 },
        { text: 'Who formulated the first law of motion?', options: ['Galileo', 'Newton', 'Einstein', 'Kepler'], correct: 1 },
        { text: 'Acceleration due to gravity is?', options: ['9.8 m/s²', '10 m/s²', '5 m/s²', '20 m/s²'], correct: 0 },
        { text: 'Define velocity?', options: ['Speed with direction', 'Speed only', 'Distance/time', 'Acceleration'], correct: 0 },
        { text: 'SI unit of force?', options: ['Dyne', 'Newton', 'Erg', 'Joule'], correct: 1 },
        { text: 'What is kinetic energy?', options: ['Energy at rest', 'Energy of motion', 'Potential', 'Heat'], correct: 1 },
        { text: 'Define friction?', options: ['Applied force', 'Opposing force', 'Magnetic force', 'Gravity'], correct: 1 },
        { text: 'SI unit of power?', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correct: 1 },
        { text: 'What is density?', options: ['Mass/Volume', 'Volume/Mass', 'Weight/Volume', 'Mass/Time'], correct: 0 },
        { text: 'Vector quantity is?', options: ['Speed', 'Temperature', 'Velocity', 'Distance'], correct: 2 },
      ],
      'Chemistry': [
        { text: 'Atomic number of Carbon?', options: ['4', '6', '8', '12'], correct: 1 },
        { text: 'Most abundant gas in atmosphere?', options: ['Oxygen', 'Nitrogen', 'Argon', 'CO2'], correct: 1 },
        { text: 'pH of pure water at 25°C?', options: ['6', '7', '8', '5'], correct: 1 },
        { text: 'Element with symbol Fe?', options: ['Fluorine', 'Iron', 'Francium', 'Fermium'], correct: 1 },
        { text: 'Chemical formula for salt?', options: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], correct: 0 },
        { text: 'Valency of oxygen?', options: ['1', '2', '3', '4'], correct: 1 },
        { text: 'Lightest element?', options: ['Helium', 'Hydrogen', 'Lithium', 'Beryllium'], correct: 1 },
        { text: 'Chemical formula for water?', options: ['H2O', 'H2O2', 'HO', 'H3O'], correct: 0 },
        { text: 'Define oxidation?', options: ['Loss of electrons', 'Gain of electrons', 'Loss of oxygen', 'Gain of hydrogen'], correct: 0 },
        { text: 'What is an acid?', options: ['pH < 7', 'pH = 7', 'pH > 7', 'No pH'], correct: 0 },
      ],
      'Mathematics': [
        { text: 'Square root of 144?', options: ['10', '12', '14', '16'], correct: 1 },
        { text: '15% of 200?', options: ['20', '25', '30', '35'], correct: 2 },
        { text: 'If x + 5 = 12, x = ?', options: ['5', '6', '7', '8'], correct: 2 },
        { text: 'Area of circle with radius 5?', options: ['25π', '10π', '50π', '100π'], correct: 0 },
        { text: '20% of 500?', options: ['50', '75', '100', '125'], correct: 2 },
        { text: 'Square root of 256?', options: ['14', '15', '16', '17'], correct: 2 },
        { text: 'If 2x = 10, x = ?', options: ['3', '4', '5', '6'], correct: 2 },
        { text: 'Circumference of circle radius 7?', options: ['14π', '49π', '7π', '28π'], correct: 0 },
        { text: '25% of 80?', options: ['15', '20', '25', '30'], correct: 1 },
        { text: 'Value of 5²?', options: ['10', '15', '20', '25'], correct: 3 },
      ],
      'Biology': [
        { text: 'Powerhouse of cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Lysosome'], correct: 1 },
        { text: 'Chambers in human heart?', options: ['2', '3', '4', '5'], correct: 2 },
        { text: 'Basic unit of life?', options: ['Atom', 'Molecule', 'Cell', 'Tissue'], correct: 2 },
        { text: 'Gas plants absorb for photosynthesis?', options: ['Oxygen', 'Nitrogen', 'CO2', 'Hydrogen'], correct: 2 },
        { text: 'Percentage of water in human body?', options: ['50%', '60%', '70%', '80%'], correct: 2 },
        { text: 'Define photosynthesis?', options: ['Energy production', 'Food production', 'Respiration', 'Decomposition'], correct: 1 },
        { text: 'Main function of mitochondria?', options: ['Photosynthesis', 'Protein synthesis', 'Energy production', 'Storage'], correct: 2 },
        { text: 'Human chromosomes?', options: ['23', '46', '48', '50'], correct: 1 },
        { text: 'Organelle for protein synthesis?', options: ['Mitochondria', 'Ribosome', 'Lysosome', 'Golgi'], correct: 1 },
        { text: 'Normal body temperature?', options: ['36°C', '37°C', '38°C', '39°C'], correct: 1 },
      ],
      'General Awareness': [
        { text: 'Capital of India?', options: ['Mumbai', 'New Delhi', 'Bangalore', 'Kolkata'], correct: 1 },
        { text: 'Current PM of India?', options: ['Modi', 'Rajiv Gandhi', 'Manmohan', 'Vajpayee'], correct: 0 },
        { text: 'Year of Indian Independence?', options: ['1945', '1947', '1950', '1952'], correct: 1 },
        { text: 'Largest planet?', options: ['Saturn', 'Venus', 'Jupiter', 'Neptune'], correct: 2 },
        { text: 'Longest river in India?', options: ['Godavari', 'Brahmaputra', 'Ganges', 'Yamuna'], correct: 2 },
        { text: 'Head of State in India?', options: ['PM', 'President', 'VP', 'Speaker'], correct: 1 },
        { text: 'How many states in India?', options: ['26', '28', '29', '31'], correct: 2 },
        { text: 'National sport of India?', options: ['Cricket', 'Hockey', 'Basketball', 'Volleyball'], correct: 1 },
        { text: 'Planet closest to sun?', options: ['Venus', 'Mercury', 'Mars', 'Earth'], correct: 1 },
        { text: 'Largest desert?', options: ['Gobi', 'Kalahari', 'Sahara', 'Arabian'], correct: 2 },
      ],
      'Reasoning': [
        { text: 'All roses are flowers, all flowers fade, then?', options: ['Inductive', 'Deductive', 'Abductive', 'Intuitive'], correct: 1 },
        { text: 'Missing number: 2, 4, 8, 16, ?', options: ['24', '28', '32', '36'], correct: 2 },
        { text: 'Next in series: 5, 10, 15, 20, ?', options: ['25', '30', '35', '40'], correct: 0 },
        { text: 'Next letter: A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], correct: 2 },
        { text: 'If APPLE = 5, FRUIT = ?', options: ['4', '5', '6', '7'], correct: 2 },
        { text: 'Series: 1, 4, 9, 16, ?', options: ['20', '24', '25', '30'], correct: 2 },
        { text: 'Odd one: 2, 4, 6, 9, 8', options: ['2', '4', '6', '9'], correct: 3 },
        { text: 'CAT = 3, DOG = ?', options: ['2', '3', '4', '5'], correct: 2 },
        { text: 'Pattern: 11, 22, 33, 44, ?', options: ['55', '60', '65', '70'], correct: 0 },
        { text: 'Next: Z, Y, X, W, ?', options: ['U', 'V', 'W', 'T'], correct: 3 },
      ],
      'Quantitative Aptitude': [
        { text: '25% of 480?', options: ['100', '110', '120', '130'], correct: 2 },
        { text: 'Speed if 6km in 2 hours?', options: ['2 km/h', '3 km/h', '4 km/h', '5 km/h'], correct: 1 },
        { text: 'Area of square side 10cm?', options: ['40 cm²', '80 cm²', '100 cm²', '120 cm²'], correct: 2 },
        { text: 'Simple interest on 1000 at 5% for 2 years?', options: ['50', '100', '150', '200'], correct: 1 },
        { text: 'Average of 10, 20, 30, 40, 50?', options: ['25', '30', '35', '40'], correct: 1 },
        { text: '10% of 1000?', options: ['50', '100', '150', '200'], correct: 1 },
        { text: 'If x : y = 3 : 5, x = 9, y = ?', options: ['12', '15', '18', '20'], correct: 1 },
        { text: 'Profit% = 25%, CP = 100, SP = ?', options: ['120', '125', '130', '135'], correct: 1 },
        { text: '20% of 250?', options: ['40', '50', '60', '70'], correct: 1 },
        { text: 'LCM of 12, 18, 24?', options: ['36', '48', '60', '72'], correct: 3 },
      ],
      'English': [
        { text: 'Choose correct spelling?', options: ['Occassion', 'Ocassion', 'Occasion', 'Ocasion'], correct: 2 },
        { text: 'Which is a noun?', options: ['Run', 'Beautiful', 'Book', 'Quickly'], correct: 2 },
        { text: 'Correct form: He _____ to school daily', options: ['go', 'goes', 'going', 'gone'], correct: 1 },
        { text: 'Plural of child?', options: ['Childs', 'Childes', 'Children', 'Childz'], correct: 2 },
        { text: 'Which is a verb?', options: ['Happy', 'House', 'Run', 'Blue'], correct: 2 },
        { text: 'Correct: He _____ been working', options: ['have', 'has', 'had', 'having'], correct: 1 },
        { text: 'Antonym of big?', options: ['Large', 'Huge', 'Small', 'Giant'], correct: 2 },
        { text: 'Correct spelling?', options: ['Recieve', 'Receive', 'Recieve', 'Recieve'], correct: 1 },
        { text: 'Part of speech: quickly?', options: ['Noun', 'Verb', 'Adjective', 'Adverb'], correct: 3 },
        { text: 'Synonym of happy?', options: ['Sad', 'Joyful', 'Angry', 'Tired'], correct: 1 },
      ],
      'General Knowledge': [
        { text: 'Capital of France?', options: ['London', 'Paris', 'Berlin', 'Madrid'], correct: 1 },
        { text: 'Largest population?', options: ['India', 'USA', 'Indonesia', 'Brazil'], correct: 0 },
        { text: 'Largest continent?', options: ['Africa', 'Europe', 'Asia', 'Australia'], correct: 2 },
        { text: 'How many continents?', options: ['5', '6', '7', '8'], correct: 2 },
        { text: 'Hottest planet?', options: ['Mercury', 'Venus', 'Mars', 'Jupiter'], correct: 1 },
        { text: 'Currency of Japan?', options: ['Won', 'Yen', 'Peso', 'Dinar'], correct: 1 },
        { text: 'Sides in hexagon?', options: ['5', '6', '7', '8'], correct: 1 },
        { text: 'Deepest ocean trench?', options: ['Mariana', 'Tonga', 'Kuril', 'Kermadec'], correct: 0 },
        { text: 'Largest mammal?', options: ['Elephant', 'Whale', 'Giraffe', 'Hippo'], correct: 1 },
        { text: 'Speed of light?', options: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'], correct: 0 },
      ],
    };

    return questions[subject] || [];
  };

  // MCQ Start Test Function
  const handleStartTest = () => {
    if (selectedSubjects.length === 0) {
      alert('Kam se kam ek subject select karo!');
      return;
    }

    let questions = [];
    selectedSubjects.forEach(subject => {
      const qs = generateQuestions(subject);
      questions = [...questions, ...qs.map(q => ({ ...q, subject }))];
    });

    questions = questions.sort(() => Math.random() - 0.5).slice(0, parseInt(questionCount));
    
    setTestQuestions(questions);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    
    const time = timeLimit ? parseInt(timeLimit) * 60 : 3600;
    setTimeRemaining(time);
    setTestActive(true);
    setScreen('mcqTest');
  };

  // Interview Start Function
  const startInterview = async () => {
    if (!interviewSelectedSubject) {
      alert('Pehle apna subject select kar!');
      return;
    }
    setInterviewStarted(true);
    await generateInterviewQuestion();
  };

  // Generate Interview Question
  const generateInterviewQuestion = async () => {
    setInterviewIsLoading(true);
    setInterviewFeedback(null);
    setInterviewUserAnswer('');

    const questionType = questionTypes[interviewQuestionCount % questionTypes.length];
    
    const prompt = `Tu ek DEI (Dayalbagh Educational Institute) B.Sc. entrance interview examiner hai.
    
Student ki information:
- Subject: ${interviewSelectedSubject}
- Interview question number: ${interviewQuestionCount + 1}
- Question type: ${questionType}

Ek professional lekin friendly interview question ask kar (Hindi/Hinglish mein). Question ko realistic aur insightful hona chahiye.
Question format: "Question: [actual question in Hindi/Hinglish]"`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          messages: [
            { role: 'user', content: prompt }
          ],
        }),
      });

      const data = await response.json();
      const question = data.content[0].text;
      setInterviewCurrentQuestion(question);
      setInterviewQuestionCount(interviewQuestionCount + 1);
    } catch (error) {
      setInterviewCurrentQuestion('❌ Error: Question load nahi ho saka. Dobara try kar.');
    }
    setInterviewIsLoading(false);
  };

  // Evaluate Interview Answer
  const evaluateInterviewAnswer = async () => {
    if (!interviewUserAnswer.trim()) {
      alert('Answer likha toh hai na! 😊');
      return;
    }

    setInterviewIsLoading(true);

    const evaluationPrompt = `Tu ek DEI interview examiner hai. Ek student ne ye question par ye answer diya:

Question: ${interviewCurrentQuestion}

Student Answer: "${interviewUserAnswer}"

Ab iska evaluation kar:
1. Answer Quality (1-10 score)
2. What was good about the answer
3. 2-3 specific improvements suggestions
4. Do's for interview (क्या करें)
5. Don'ts for interview (क्या न करें)

Format mein dena:
SCORE: [number]/10
STRENGTHS: [kya acha tha]
IMPROVEMENTS: [kya badal sakta hai]
DO'S: [3 tips]
DON'TS: [3 tips]`;

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 500,
          messages: [
            { role: 'user', content: evaluationPrompt }
          ],
        }),
      });

      const data = await response.json();
      const feedbackText = data.content[0].text;
      setInterviewFeedback(feedbackText);
      
      setInterviewResponses([...interviewResponses, {
        question: interviewCurrentQuestion,
        answer: interviewUserAnswer,
        feedback: feedbackText,
        questionNum: interviewQuestionCount
      }]);
    } catch (error) {
      setInterviewFeedback('❌ Feedback generate nahi ho saka.');
    }
    setInterviewIsLoading(false);
  };

  // Next Interview Question
  const nextInterviewQuestion = async () => {
    await generateInterviewQuestion();
  };

  // Reset Interview
  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewCurrentQuestion(null);
    setInterviewUserAnswer('');
    setInterviewFeedback(null);
    setInterviewQuestionCount(0);
    setInterviewSelectedSubject('');
    setInterviewResponses([]);
    setScreen('mainMenu');
  };

  // ============= MAIN MENU SCREEN =============
  if (screen === 'mainMenu') {
    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-2xl shadow-xl p-8 mb-6 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold text-indigo-600 mb-2">Welcome to ExamPrep Pro 🚀</h1>
                <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Start your exam preparation journey</p>
              </div>
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-700" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* MCQ Practice Card */}
            <div
              onClick={() => {
                setSelectedSubjects(examConfig[selectedExam] || []);
                setScreen('mcqSetup');
              }}
              className={`rounded-xl p-8 border-2 hover:shadow-lg transition-all cursor-pointer ${darkMode ? 'bg-gradient-to-br from-green-900 to-green-800 border-green-700' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'}`}
            >
              <h2 className="text-2xl font-bold text-green-600 mb-4">📚 MCQ Practice</h2>
              <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Solve hundreds of questions</p>
            </div>

            {/* Interview Practice Card - NEW */}
            <div
              onClick={() => {
                setInterviewStarted(false);
                setInterviewSelectedSubject('');
                setScreen('interviewMode');
              }}
              className={`rounded-xl p-8 border-2 hover:shadow-lg transition-all cursor-pointer ${darkMode ? 'bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300'}`}
            >
              <h2 className="text-2xl font-bold text-purple-600 mb-4">🎤 AI Interview Practice</h2>
              <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Practice with AI interviewer</p>
            </div>

            {/* Select Exam Card */}
            <div
              onClick={() => setScreen('examSelect')}
              className={`rounded-xl p-8 border-2 hover:shadow-lg transition-all cursor-pointer ${darkMode ? 'bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'}`}
            >
              <h2 className="text-2xl font-bold text-blue-600 mb-4">📖 Select Exam</h2>
              <p className={darkMode ? 'text-slate-300' : 'text-gray-700'}>Choose your target exam</p>
            </div>
          </div>

          <div className={`rounded-xl p-6 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-blue-50 border-2 border-blue-300'}`}>
            <h3 className="font-bold text-lg mb-2 text-blue-600">ℹ️ Currently Selected Exam:</h3>
            <p className={`text-lg font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{selectedExam}</p>
          </div>
        </div>
      </div>
    );
  }

  // ============= INTERVIEW MODE SETUP SCREEN =============
  if (screen === 'interviewMode' && !interviewStarted) {
    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-6`}>
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-2xl shadow-xl p-8 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white'}`}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-indigo-600 mb-2">DEI Interview Practice</h1>
              <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>AI Interviewer ke saath apni practice kar</p>
            </div>

            <div className={`border-l-4 border-blue-500 p-6 mb-8 rounded transition-colors ${darkMode ? 'bg-blue-900/20 text-slate-300' : 'bg-blue-50'}`}>
              <h2 className="text-lg font-semibold text-blue-600 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Ye App Kya Karega?
              </h2>
              <ul className={`space-y-2 ${darkMode ? 'text-slate-300' : 'text-blue-800'}`}>
                <li>✓ Real interview jaisa questions puchega</li>
                <li>✓ Tere answers evaluate karega</li>
                <li>✓ Detailed feedback dega</li>
                <li>✓ Interview tips & tricks sikhayega</li>
                <li>✓ Do's aur Don'ts highlight karega</li>
              </ul>
            </div>

            <div className="mb-8">
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-800'}`}>Apna Subject Select Kar:</h3>
              <div className="grid grid-cols-2 gap-4">
                {interviewSubjects.map(subject => (
                  <button
                    key={subject}
                    onClick={() => setInterviewSelectedSubject(subject)}
                    className={`p-4 rounded-lg font-semibold text-lg transition-all ${
                      interviewSelectedSubject === subject
                        ? darkMode
                          ? 'bg-indigo-600 text-white shadow-lg scale-105'
                          : 'bg-indigo-600 text-white shadow-lg scale-105'
                        : darkMode
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startInterview}
              disabled={!interviewSelectedSubject}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                interviewSelectedSubject
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
                  : darkMode
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Interview Shuru Kar 🎤
            </button>

            <button
              onClick={() => setScreen('mainMenu')}
              className={`w-full mt-4 py-3 rounded-lg font-bold transition-all ${
                darkMode
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              Back to Menu
            </button>

            <div className={`mt-8 border-l-4 border-yellow-500 p-6 rounded transition-colors ${darkMode ? 'bg-yellow-900/20 text-slate-300' : 'bg-yellow-50'}`}>
              <p className={`font-semibold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>💡 Best Practice Tips:</p>
              <ul className={`text-sm space-y-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                <li>• Clear aur confident answers dena</li>
                <li>• Subject ke baare mein genuine interest dikhana</li>
                <li>• Career goals clear aur logical hone chahiye</li>
                <li>• Eye contact aur body language important hai</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============= INTERVIEW ACTIVE SCREEN =============
  if (screen === 'interviewMode' && interviewStarted) {
    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gradient-to-br from-indigo-900 to-blue-900' : 'bg-gradient-to-br from-indigo-50 to-blue-100'} p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600">DEI Interview Practice</h1>
              <p className={`${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>Subject: <span className="font-semibold">{interviewSelectedSubject}</span> | Question {interviewQuestionCount}</p>
            </div>
            <button
              onClick={resetInterview}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Interview Area */}
            <div className="lg:col-span-2">
              <div className={`rounded-2xl shadow-xl p-8 mb-6 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white'}`}>
                {interviewCurrentQuestion ? (
                  <div>
                    <div className={`border-l-4 border-indigo-500 p-6 rounded mb-6 transition-colors ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                      <p className={`text-sm font-semibold uppercase tracking-wide mb-2 ${darkMode ? 'text-indigo-400' : 'text-gray-600'}`}>Interviewer Ka Question</p>
                      <p className={`text-xl font-semibold ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>{interviewCurrentQuestion}</p>
                    </div>

                    {!interviewFeedback ? (
                      <div>
                        <label className={`block text-sm font-semibold mb-3 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>Apna Answer Likha:</label>
                        <textarea
                          value={interviewUserAnswer}
                          onChange={(e) => setInterviewUserAnswer(e.target.value)}
                          placeholder="Apna answer yahan likho... (Hindi/Hinglish dono chalega)"
                          className={`w-full h-32 p-4 border-2 rounded-lg focus:border-indigo-500 focus:outline-none resize-none transition-colors ${
                            darkMode
                              ? 'bg-slate-700 border-slate-600 text-white'
                              : 'bg-white border-gray-200'
                          }`}
                        />
                        <button
                          onClick={evaluateInterviewAnswer}
                          disabled={interviewIsLoading}
                          className={`w-full mt-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                            interviewIsLoading
                              ? darkMode
                                ? 'bg-slate-700 text-slate-500'
                                : 'bg-gray-300 text-gray-500'
                              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                          }`}
                        >
                          <Send className="w-4 h-4" />
                          {interviewIsLoading ? 'Evaluate ho raha hai...' : 'Answer Submit Kar & Feedback Le'}
                        </button>
                      </div>
                    ) : (
                      <div className={`border-2 rounded-lg p-6 transition-colors ${darkMode ? 'bg-green-900/20 border-green-600' : 'bg-green-50 border-green-200'}`}>
                        <p className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-900'}`}>
                          <CheckCircle className="w-5 h-5" />
                          Interviewer Ki Feedback
                        </p>
                        <div className={`whitespace-pre-wrap text-sm leading-relaxed font-mono ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                          {interviewFeedback}
                        </div>
                        <button
                          onClick={nextInterviewQuestion}
                          disabled={interviewIsLoading}
                          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-all"
                        >
                          {interviewIsLoading ? 'Loading...' : 'Next Question 👉'}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={`text-center py-8 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    <p>Loading question...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tips Sidebar */}
            <div className="lg:col-span-1">
              <div className={`rounded-2xl shadow-lg p-6 sticky top-6 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white'}`}>
                <h3 className="font-bold text-lg text-indigo-600 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Quick Tips
                </h3>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-l-4 border-green-500 transition-colors ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                    <p className={`font-semibold text-sm mb-2 ${darkMode ? 'text-green-400' : 'text-green-900'}`}>✅ DO'S</p>
                    <ul className={`text-xs space-y-1 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                      <li>• Clear aur confident bolna</li>
                      <li>• Example dena answer mein</li>
                      <li>• Eye contact rakhna</li>
                      <li>• Pause lena sochne ke liye</li>
                      <li>• Honest answer dena</li>
                    </ul>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 border-red-500 transition-colors ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                    <p className={`font-semibold text-sm mb-2 ${darkMode ? 'text-red-400' : 'text-red-900'}`}>❌ DON'Ts</p>
                    <ul className={`text-xs space-y-1 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                      <li>• Jaldi bolna ya stammer</li>
                      <li>• Jhooth bolna</li>
                      <li>• Negative baatein na karna</li>
                      <li>• Mobile use na karna</li>
                      <li>• Rude ya arrogant na dikhna</li>
                    </ul>
                  </div>

                  <div className={`p-4 rounded-lg border-l-4 border-blue-500 transition-colors ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                    <p className={`font-semibold text-sm mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-900'}`}>💡 Pro Tips</p>
                    <ul className={`text-xs space-y-1 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                      <li>• Subject research karna</li>
                      <li>• Career path plan karna</li>
                      <li>• Confidence important hai</li>
                      <li>• Smile rakhna</li>
                    </ul>
                  </div>
                </div>

                <div className={`mt-6 p-4 rounded-lg border-l-4 border-yellow-500 transition-colors ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                  <p className={`text-xs ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                    <span className="font-bold">Questions Completed:</span> {interviewQuestionCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div ref={messagesEndRef} />
      </div>
    );
  }

  // ============= MCQ SETUP SCREEN =============
  if (screen === 'mcqSetup') {
    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-green-50 to-emerald-100'} p-6`}>
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-2xl shadow-xl p-8 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-green-600">MCQ Setup</h1>
              <button onClick={() => setScreen('mainMenu')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">Back</button>
            </div>

            {/* Subjects */}
            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-800'}`}>📚 Subjects</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(examConfig[selectedExam] || []).map(subject => (
                  <label key={subject} className={`flex items-center gap-3 p-3 border-2 rounded-lg hover:border-green-500 cursor-pointer transition-all ${
                    darkMode
                      ? selectedSubjects.includes(subject)
                        ? 'bg-green-900 border-green-600'
                        : 'border-slate-600'
                      : selectedSubjects.includes(subject)
                      ? 'bg-green-50 border-green-500'
                      : 'border-gray-200'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSubjects([...selectedSubjects, subject]);
                        } else {
                          setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
                        }
                      }}
                      className="w-5 h-5 accent-green-500"
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : ''}`}>{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-800'}`}>🔢 Questions</h3>
              <div className="grid grid-cols-5 gap-2">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(count => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`px-4 py-3 border-2 rounded-lg font-bold transition-all ${
                      questionCount === count
                        ? darkMode
                          ? 'border-green-500 bg-green-900 text-green-300'
                          : 'border-green-500 bg-green-50 text-green-700'
                        : darkMode
                        ? 'border-slate-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-800'}`}>⏱️ Time (Minutes)</h3>
              <input
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                placeholder="Leave empty for unlimited"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:border-green-500 focus:outline-none transition-colors ${
                  darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300'
                }`}
                min="1"
              />
            </div>

            <button
              onClick={handleStartTest}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-all text-lg mb-4"
            >
              Test Shuru Kar 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============= MCQ TEST SCREEN =============
  if (screen === 'mcqTest' && testQuestions.length > 0) {
    const currentQuestion = testQuestions[currentQuestionIndex];
    const answered = currentQuestionIndex in selectedAnswers;

    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} p-6`}>
        {/* Header */}
        <div className={`rounded-xl shadow-lg p-6 mb-6 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white border-2 border-gray-200'}`}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Q{currentQuestionIndex + 1}/{testQuestions.length}</h1>
            <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg">
              <Clock className="w-5 h-5 text-red-600" />
              <span className="font-bold text-red-600 text-lg">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Question */}
          <div className={`rounded-xl shadow-lg p-8 mb-6 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white'}`}>
            <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-slate-300' : 'text-gray-900'}`}>{currentQuestion.text}</h2>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswers({...selectedAnswers, [currentQuestionIndex]: idx})}
                  className={`w-full text-left p-4 border-2 rounded-lg font-semibold transition-all ${
                    selectedAnswers[currentQuestionIndex] === idx
                      ? darkMode
                        ? 'border-indigo-500 bg-indigo-900 text-indigo-300'
                        : 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : darkMode
                      ? 'border-slate-600 hover:border-indigo-400 text-white'
                      : 'border-gray-300 hover:border-indigo-300 text-gray-900'
                  }`}
                >
                  <span className="inline-block w-8 h-8 rounded-full border-2 border-current text-center leading-6 mr-3">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className={`rounded-xl shadow-lg p-6 flex gap-4 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white'}`}>
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
                currentQuestionIndex === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <button
              onClick={() => {
                if (currentQuestionIndex === testQuestions.length - 1) {
                  setTestActive(false);
                  setScreen('results');
                } else {
                  setCurrentQuestionIndex(currentQuestionIndex + 1);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition-all ml-auto"
            >
              {currentQuestionIndex === testQuestions.length - 1 ? 'Submit' : 'Next'}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============= RESULTS SCREEN =============
  if (screen === 'results') {
    let correct = 0;
    testQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) correct++;
    });
    const percentage = (correct / testQuestions.length) * 100;
    const attempted = Object.keys(selectedAnswers).length;

    return (
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-purple-600 to-indigo-700'}`}>
        <div className={`rounded-3xl shadow-2xl p-12 max-w-2xl w-full transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white'}`}>
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h1 className="text-4xl font-bold text-green-600 mb-2">Test Complete! 🎉</h1>
          </div>

          {/* Score Card */}
          <div className={`rounded-2xl p-8 mb-8 transition-colors ${darkMode ? 'bg-gradient-to-r from-purple-900 to-indigo-900' : 'bg-gradient-to-r from-purple-100 to-indigo-100'}`}>
            <p className={`text-lg mb-4 ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>Your Score</p>
            <p className="text-6xl font-bold text-purple-600 mb-4">{correct}/{testQuestions.length}</p>
            <p className="text-3xl font-bold text-indigo-600">{percentage.toFixed(1)}%</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className={`rounded-xl p-6 text-center transition-colors ${darkMode ? 'bg-green-900 border-2 border-green-600' : 'bg-green-50 border-2 border-green-300'}`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>{correct}</p>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>Correct</p>
            </div>

            <div className={`rounded-xl p-6 text-center transition-colors ${darkMode ? 'bg-red-900 border-2 border-red-600' : 'bg-red-50 border-2 border-red-300'}`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-red-300' : 'text-red-600'}`}>{attempted - correct}</p>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>Incorrect</p>
            </div>

            <div className={`rounded-xl p-6 text-center transition-colors ${darkMode ? 'bg-yellow-900 border-2 border-yellow-600' : 'bg-yellow-50 border-2 border-yellow-300'}`}>
              <p className={`text-2xl font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>{testQuestions.length - attempted}</p>
              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>Unattempted</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setScreen('mainMenu');
                setTestActive(false);
                setTestQuestions([]);
                setSelectedAnswers({});
              }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all"
            >
              <Home className="w-5 h-5 inline mr-2" />
              Home
            </button>

            <button
              onClick={() => {
                setScreen('mcqSetup');
                setTestActive(false);
                setTestQuestions([]);
                setSelectedAnswers({});
              }}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" />
              New Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============= EXAM SELECT SCREEN =============
  if (screen === 'examSelect') {
    const exams = Object.keys(examConfig);

    return (
      <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-50 to-purple-100'} p-6`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-2xl shadow-xl p-8 mb-6 transition-colors ${darkMode ? 'bg-slate-800 border-2 border-slate-700' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-indigo-600">Select Your Exam</h1>
              <button onClick={() => setScreen('mainMenu')} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">Back</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams.map(exam => (
              <button
                key={exam}
                onClick={() => {
                  setSelectedExam(exam);
                  setSelectedSubjects(examConfig[exam] || []);
                  setScreen('mainMenu');
                }}
                className={`p-6 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                  selectedExam === exam
                    ? darkMode
                      ? 'border-indigo-500 bg-indigo-900'
                      : 'border-indigo-500 bg-indigo-50'
                    : darkMode
                    ? 'border-slate-600 bg-slate-700 hover:border-indigo-400'
                    : 'border-gray-300 bg-white hover:border-indigo-400'
                }`}
              >
                <h3 className={`font-bold text-lg ${selectedExam === exam ? 'text-indigo-600' : darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{exam}</h3>
                <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {examConfig[exam].length} subjects
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ExamPrepApp;