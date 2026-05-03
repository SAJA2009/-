import { GoogleGenAI, Type } from "@google/genai";
import { SolutionResponse, QuizQuestion, Subject, Semester, GradeLevel } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getSubjectArabic = (subject: Subject) => {
  const map: Record<Subject, string> = {
    math: 'الرياضيات',
    physics: 'الفيزياء',
    chemistry: 'الكيمياء',
    biology: 'الأحياء'
  };
  return map[subject];
};

const getSemesterArabic = (semester: Semester) => {
  const map: Record<Semester, string> = {
    semester_1: 'الفصل الدراسي الأول',
    semester_2_3: 'الفصل الدراسي الثاني'
  };
  return map[semester];
};

const getGradeArabic = (grade: GradeLevel) => {
  const map: Record<GradeLevel, string> = {
    grade_10: 'الصف الأول الثانوي',
    grade_11: 'الصف الثاني الثانوي',
    grade_12: 'الصف الثالث الثانوي'
  };
  return map[grade];
};

export const solveProblem = async (
  query: string, 
  subject: Subject, 
  semester: Semester,
  grade: GradeLevel
): Promise<SolutionResponse> => {
  const subjectName = getSubjectArabic(subject);
  const semesterName = getSemesterArabic(semester);
  const gradeName = getGradeArabic(grade);

  const semesterDesc = semester === 'semester_1' 
    ? 'الفصل الدراسي الأول (الترم الأول)' 
    : 'منهج الفصل الدراسي الثاني والفصل الدراسي الثالث المدمجة (الترم الثاني والترم الثالث) لضمان تغطية كامل المنهج المقر لوزارة التعليم';

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `أنت معلم خبير في المنهج السعودي للمرحلة الثانوية. 
    المرحلة: ${gradeName}
    المادة: ${subjectName}
    الفصل المختار: ${semesterName} (${semesterDesc})
    السؤال: ${query}
    قم بحل السؤال بالتفصيل بناءً على كتاب وزارة التعليم السعودي المخصص لهذا المستوى. 
    ركز على القوانين المستخدمة والخطوات التعليمية كما وردت في المنهج.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          answer: { type: Type.STRING },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                explanation: { type: Type.STRING },
                formula: { type: Type.STRING }
              },
              required: ["title", "explanation"]
            }
          },
          lawsUsed: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["answer", "steps", "lawsUsed"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const chatWithTeacher = async (
  messages: { role: string, content: string }[],
  subject: Subject,
  grade: GradeLevel,
  gender: 'male' | 'female'
): Promise<string> => {
  const subjectName = getSubjectArabic(subject);
  const gradeName = getGradeArabic(grade);
  const persona = gender === 'male' ? 'معلم' : 'معلمة';
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: messages.map(m => ({ role: m.role as any, parts: [{ text: m.content }] })),
    config: {
      systemInstruction: `أنت ${persona} خبير في المنهج السعودي للمرحلة الثانوية في مادة ${subjectName} لـ ${gradeName}. 
      أجب بأسلوب تعليمي، مشجع، ومبسط. التزم فقط بالمعلومات العلمية الدقيقة.
      في حال طرح الطالب سؤالاً أو مسألة، يجب عليك شرحها بالتفصيل الممل، وتقسيم الحل إلى خطوات واضحة (خطوة 1، خطوة 2...)، مع ذكر القوانين والمفاهيم المستخدمة من المنهج الدراسي السعودي الرسمي لوزارة التعليم.`
    }
  });

  return response.text;
};

export const generateQuiz = async (
  subject: Subject,
  semester: Semester,
  grade: GradeLevel,
  topic?: string
): Promise<QuizQuestion[]> => {
  const subjectName = getSubjectArabic(subject);
  const semesterName = getSemesterArabic(semester);
  const gradeName = getGradeArabic(grade);

  const semesterDesc = semester === 'semester_1' 
    ? 'الفصل الدراسي الأول (الترم الأول)' 
    : 'منهج الفصل الدراسي الثاني والفصل الدراسي الثالث المدمجة (الترم الثاني والترم الثالث) لضمان تغطية كامل المنهج المقر لوزارة التعليم';

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `أنت خبير في المناهج الدراسية السعودية للمرحلة الثانوية. الوقت الحالي هو ${new Date().toISOString()}.
    قم بتوليد 5 أسئلة اختيار من متعدد "جديدة تماماً ومبتكرة" لمادة ${subjectName}، ${gradeName}، ${semesterName} ${topic ? `في موضوع ${topic}` : ''}.
    
    سياق المنهج المطلوب: ${semesterDesc}.

    شروط صارمة للتنوع:
    1. يجب أن تكون الأسئلة متنوعة (نظري، عملي، استنتاجي) ومستوحاة من كتب وزارة التعليم السعودية الرسمية.
    2. "هام جداً": لا تكرر الأسئلة الشائعة، حاول اختيار تفاصيل مختلفة من الدروس في كل مرة.
    3. في حال كان الفصل هو "الفصل الدراسي الثاني"، يجب أن تشمل الأسئلة مفاهيم متنوعة من الكتب المحددة للترم الثاني والترم الثالث لهذا العام الدراسي.
    4. استخدم المصطلحات العلمية الدقيقة كما وردت في المنهج السعودي.
    5. تجنب أي معلومات خارجية أو عامة خارج نطاق الكتب الدراسية السعودية.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateStandardizedQuiz = async (
  type: 'qudurat' | 'tahsili',
  subject?: Subject
): Promise<QuizQuestion[]> => {
  let focus = '';
  if (type === 'qudurat') {
    focus = subject === 'math' ? 'الجانب الكمي (الرياضيات)' : 'الجانب اللفظي (اللغة العربية)';
  } else {
    focus = `التحصيلي في مادة ${subject ? getSubjectArabic(subject) : 'العلمية'}`;
  }

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `أنت خبير في اختبارات قياس السعودية. الوقت الحالي هو ${new Date().toISOString()}.
    قم بتوليد 5 أسئلة اختبار ${type === 'qudurat' ? 'القدرات' : 'التحصيلي'} "مبتكرة وغير مكررة" مع التركيز حصرياً على ${focus} لطلاب الثانوي في السعودية.
    
    شروط العمل:
    1. يجب أن تكون الأسئلة مبنية بالكامل على مفاهيم المنهج الدراسي السعودي الحالي وبنفس نمط وصعوبة الاختبارات الفعلية من مركز (قياس). 
    2. تأكد من أن الأسئلة تغطي مهارات مختلفة في كل مرة (مثل: استنتاج، حل مشكلات، علاقات منطقية).
    3. لا تكرر الأسئلة الكلاسيكية التي يمكن العثور عليها بسهولة في التجميعات القديمة؛ ابحث عن سياقات جديدة للمفاهيم الثابتة.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};
