import { Subject, GradeLevel, Semester } from "./types";

export interface CurriculumChapter {
  id: string;
  title: string;
  description: string;
}

export const BIOLOGY_CHAPTERS: CurriculumChapter[] = [
  { 
    id: "chapter_1", 
    title: "الفصل 1: الجهازان الهيكلي والعضلي", 
    description: "تركيب الجهاز الهيكلي، وظائف العظام، أنواع العضلات، وانقباض العضلات." 
  },
  { 
    id: "chapter_2", 
    title: "الفصل 2: الجهاز العصبي", 
    description: "تركيب الخلية العصبية، نقل السيال العصبي، وتنظيم الجهاز العصبي." 
  },
  { 
    id: "chapter_3", 
    title: "الفصل 3: أجهزة الدوران والتنفس والإخراج", 
    description: "تركيب القلب والأوعية الدموية، ميكانيكا التنفس، وظائف الكلية." 
  },
  { 
    id: "chapter_4", 
    title: "الفصل 4: جهازا الهضم والغدد الصم", 
    description: "مراحل الهضم، امتصاص الغذاء، وأنواع الهرمونات ووظائفها." 
  },
  { 
    id: "chapter_5", 
    title: "الفصل 5: التكاثر والنمو في الإنسان", 
    description: "جهاز التكاثر الذكري والأنثوي، مراحل نمو الجنين قبل الولادة." 
  },
  { 
    id: "chapter_6", 
    title: "الفصل 6: جهاز المناعة", 
    description: "المناعة غير المتخصصة (العامة)، والمناعة المتخصصة (النوعية)." 
  },
  { 
    id: "chapter_7", 
    title: "الفصل 7: التكاثر الخلوي", 
    description: "النمو الخلوي، الانقسام المتساوي، وانقسام السيتوبلازم، تنظيم دورة الخلية." 
  },
  { 
    id: "chapter_8", 
    title: "الفصل 8: التكاثر الجنسي والوراثة", 
    description: "الانقسام المنصّف، الوراثة المندلية، ارتباط الجينات وتعدّد المجموعات الكروموسومية." 
  },
  { 
    id: "chapter_9", 
    title: "الفصل 9: الوراثة المعقدة والوراثة البشرية", 
    description: "الأنماط الأساسية لوراثة الإنسان، الأنماط الوراثية المعقدة، الكروموسومات." 
  },
  { 
    id: "chapter_10", 
    title: "الفصل 10: الوراثة الجزيئية", 
    description: "المادة الوراثية DNA، تضاعف DNA، البروتين، التنظيم الجيني والطفرة." 
  }
];

export const MATH_CHAPTERS: CurriculumChapter[] = [
  { 
    id: "math_ch1", 
    title: "الفصل 1: العلاقات والدوال النسبية", 
    description: "ضرب العبارات النسبية وقسمتها، جمع العبارات النسبية وطرحها، تمثيل الدوال النسبية بيانياً، وتغير الدوال." 
  },
  { 
    id: "math_ch2", 
    title: "الفصل 2: المتتابعات والمتسلسلات", 
    description: "المتتابعات كدوال، المتتابعات والمتسلسلات الحسابية والهندسية، والبرهان بالاستقراء الرياضي." 
  },
  { 
    id: "math_ch3", 
    title: "الفصل 3: الاحتمالات", 
    description: "التمثيل البياني لتوزيعات الاحتمال، الاحتمال المشروط، واختبارات الفرضيات." 
  },
  { 
    id: "math_ch4", 
    title: "الفصل 4: حساب المثلثات", 
    description: "الدوال المثلثية في المثلثات قائمة الزاوية، الزوايا وقياساتها، والتمثيل البياني للدوال المثلثية." 
  }
];

export const CHEMISTRY_CHAPTERS: CurriculumChapter[] = [
  { 
    id: "chem_ch1", 
    title: "الفصل 1: الطاقة والتغيرات الكيميائية", 
    description: "الطاقة، الحرارة، المحتوى الحراري، والمعادلات الكيميائية الحرارية." 
  },
  { 
    id: "chem_ch2", 
    title: "الفصل 2: سرعة التفاعلات الكيميائية", 
    description: "نظرية التصادم، العوامل المؤثرة في سرعة التفاعل، وقوانين سرعة التفاعل." 
  },
  { 
    id: "chem_ch3", 
    title: "الفصل 3: الاتزان الكيميائي", 
    description: "حالة الاتزان الديناميكي، العوامل المؤثرة في الاتزان، وثابت الاتزان." 
  },
  { 
    id: "chem_ch4", 
    title: "الفصل 4: الهيدروكربونات", 
    description: "الألكانات، الألكينات، الألكاينات، والمتشكلات." 
  },
  { 
    id: "chem_ch5", 
    title: "الفصل 5: مشتقات المركبات الهيدروكربونية", 
    description: "هاليدات الألكيل، الكحولات، الإيثرات، الأمينات، والكربونيل." 
  },
  { 
    id: "chem_ch6", 
    title: "الفصل 6: المركبات العضوية الحيوية", 
    description: "البروتينات، الكربوهيدرات، الليبيدات، والأحماض النووية." 
  }
];

export const PHYSICS_CHAPTERS: CurriculumChapter[] = [
  { 
    id: "phys_ch1", 
    title: "الفصل 1: الجاذبية", 
    description: "حركة الكواكب والأقمار الصناعية، قانون الجذب العالمي لنيوتن، وقياس ثابت الجذب العام." 
  },
  { 
    id: "phys_ch2", 
    title: "الفصل 2: الحركة الدورانية", 
    description: "وصف الحركة الدورانية، العزم، محصلة العزم، ومركز الكتلة." 
  },
  { 
    id: "phys_ch3", 
    title: "الفصل 3: الشغل والطاقة والآلات البسيطة", 
    description: "الشغل، القدرة، والآلات البسيطة والمركبة." 
  },
  { 
    id: "phys_ch4", 
    title: "الفصل 4: الطاقة وحفظها", 
    description: "الأشكال المتعددة للطاقة، حفظ الطاقة، والتصادمات." 
  },
  { 
    id: "phys_ch5", 
    title: "الفصل 5: الطاقة الحرارية", 
    description: "درجة الحرارة والطاقة الحرارية، تغيرات حالة المادة، والقانونان الأول والثاني للديناميكا الحرارية." 
  }
];

export const SUBJECT_TOPICS: Record<string, CurriculumChapter[]> = {
  "biology_grade_10_semester_1": BIOLOGY_CHAPTERS,
  "biology_grade_10_semester_2_3": BIOLOGY_CHAPTERS,
  "biology_grade_11_semester_1": BIOLOGY_CHAPTERS,
  "biology_grade_11_semester_2_3": BIOLOGY_CHAPTERS,
  "biology_grade_12_semester_1": BIOLOGY_CHAPTERS,
  "biology_grade_12_semester_2_3": BIOLOGY_CHAPTERS,
  
  "math_grade_10_semester_1": MATH_CHAPTERS,
  "math_grade_10_semester_2_3": MATH_CHAPTERS,
  "math_grade_11_semester_1": MATH_CHAPTERS,
  "math_grade_11_semester_2_3": MATH_CHAPTERS,
  "math_grade_12_semester_1": MATH_CHAPTERS,
  "math_grade_12_semester_2_3": MATH_CHAPTERS,
  
  "chemistry_grade_10_semester_1": CHEMISTRY_CHAPTERS,
  "chemistry_grade_10_semester_2_3": CHEMISTRY_CHAPTERS,
  "chemistry_grade_11_semester_1": CHEMISTRY_CHAPTERS,
  "chemistry_grade_11_semester_2_3": CHEMISTRY_CHAPTERS,
  "chemistry_grade_12_semester_1": CHEMISTRY_CHAPTERS,
  "chemistry_grade_12_semester_2_3": CHEMISTRY_CHAPTERS,
  
  "physics_grade_10_semester_1": PHYSICS_CHAPTERS,
  "physics_grade_10_semester_2_3": PHYSICS_CHAPTERS,
  "physics_grade_11_semester_1": PHYSICS_CHAPTERS,
  "physics_grade_11_semester_2_3": PHYSICS_CHAPTERS,
  "physics_grade_12_semester_1": PHYSICS_CHAPTERS,
  "physics_grade_12_semester_2_3": PHYSICS_CHAPTERS,
};

