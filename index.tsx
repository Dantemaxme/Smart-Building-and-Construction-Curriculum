
import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  BookOpen, Search, Calendar, Layout, GraduationCap, 
  Clock, CreditCard, FileText, X, Info, Layers, 
  Compass, PenTool, Monitor, Building, Activity,
  ChevronDown, Filter, ArrowRight
} from 'lucide-react';

// --- Types ---

type AssessmentType = '考试' | '考查' | 'S' | 'C'; 
type CourseNature = '必修' | '限选' | '任选';

interface Course {
  id: number;
  name: string;
  enName: string;
  code: string;
  category: string; // Main category
  subcategory: string; // Sub header
  nature: CourseNature;
  credit: number;
  totalHours: string; 
  assessment: string;
  semester: number;
  description?: string;
}

// --- Data ---

const COURSES: Course[] = [
  // --- 一、通识教育 ---
  // 思想政治类
  { id: 1, name: "四史", enName: "Four History", code: "231304002", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 1, totalHours: "16 (讲授:16)", assessment: "考查", semester: 1, description: "《四史》是一门高校思想政治选择性必修课，涵盖党史、新中国史、改革开放史和社会主义发展史四个板块。课程旨在帮助学生从历史中汲取智慧，理解红色政权、新中国和中国特色社会主义的来之不易。通过自主学习和互动探讨，引导学生树立唯物主义历史观，增强分析问题的能力，坚定四个自信。" },
  { id: 2, name: "中国近现代史纲要", enName: "Survey of Modern Chinese History", code: "231304001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考试", semester: 1, description: "《中国近现代史纲要》是面向全国高校各专业本科生的思想政治理论必修课程。课程旨在帮助学生掌握近现代中国社会发展与革命历程的内在规律，深刻理解历史和人民选择马克思主义、中国共产党、社会主义道路与改革开放的必然性。通过系统学习，引导学生树立唯物史观，增强“四个自信”，自觉担当起实现中华民族伟大复兴的时代使命。" },
  { id: 3, name: "形势与政策 1", enName: "Position and Policy 1", code: "231306001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 1, totalHours: "16", assessment: "考查", semester: 2, description: "《形势与政策》是高校思想政治理论必修课，承担引导大学生准确理解党和国家方针政策的重要使命。课程围绕习近平新时代中国特色社会主义思想，设置全面从严治党、经济社会发展、港澳台工作及国际形势等专题教学。通过时效性理论武装与针对性教育引导，帮助学生树立正确的世界观、人生观和价值观，坚定“四个自信”。" },
  { id: 3002, name: "形势与政策 2", enName: "Position and Policy 2", code: "231306002", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 0.5, totalHours: "8", assessment: "考查", semester: 4, description: "《形势与政策》是高校思想政治理论必修课，承担引导大学生准确理解党和国家方针政策的重要使命。课程围绕习近平新时代中国特色社会主义思想，设置全面从严治党、经济社会发展、港澳台工作及国际形势等专题教学。通过时效性理论武装与针对性教育引导，帮助学生树立正确的世界观、人生观和价值观，坚定“四个自信”。" },
  { id: 3003, name: "形势与政策 3", enName: "Position and Policy 3", code: "231306003", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 0.5, totalHours: "8", assessment: "考查", semester: 6, description: "《形势与政策》是高校思想政治理论必修课，承担引导大学生准确理解党和国家方针政策的重要使命。课程围绕习近平新时代中国特色社会主义思想，设置全面从严治党、经济社会发展、港澳台工作及国际形势等专题教学。通过时效性理论武装与针对性教育引导，帮助学生树立正确的世界观、人生观和价值观，坚定“四个自信”。"  },
  { id: 4, name: "思想道德与法治", enName: "Ideology and Morality and Rule of Law", code: "231303001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考查", semester: 2, description: "《思想道德与法治》是高校思想政治理论必修课，以马克思主义和习近平新时代中国特色社会主义思想为指导，融合人生观、价值观、道德观与法治观教育。课程通过理论学习和实践体验，引导学生提升思想道德素质与法治素养，自觉践行社会主义核心价值观。旨在为学生成长为担当民族复兴大任的时代新人奠定坚实的思想基础和法律意识。"  },
  { id: 5, name: "习近平新时代中国特色社会主义思想概论", enName: "Intro to Xi Jinping Thought", code: "231302002", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考查", semester: 2, description: "《习近平新时代中国特色社会主义思想概论》是高校思想政治理论必修课程，系统阐述这一思想的科学体系、核心要义与实践要求。课程旨在帮助学生掌握其内在逻辑与马克思主义立场观点方法，培养运用科学理论分析和解决问题的能力。引导学生将学理认知转化为坚定信念，把爱国情、强国志、报国行自觉融入中华民族伟大复兴的奋斗实践。"  },
  { id: 6, name: "马克思主义基本原理", enName: "Theory of Marxism", code: "231301001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考试", semester: 3, description: "《马克思主义基本原理》是高校思想政治理论课程体系中的核心课程，系统阐述马克思主义哲学、政治经济学和科学社会主义的基本原理与方法。课程旨在帮助学生掌握马克思主义的科学世界观和方法论，并运用其分析与解决实际问题。通过理论学习与实践结合，引导学生树立共产主义崇高理想，增强认识世界和改造世界的能力。"  },
  { id: 7, name: "毛泽东思想和中国特色社会主义理论体系概论", enName: "Intro to Mao Zedong Thoughts...", code: "231302001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考试", semester: 4, description: "《毛泽东思想和中国特色社会主义理论体系概论》是我国高校思想政治理论必修课程，系统阐述马克思主义中国化的理论成果及其内在联系。课程着重培养学生运用马克思主义立场观点方法分析解决问题的能力，增强中国特色社会主义道路自信、理论自信、制度自信、文化自信。通过理论联系实际的教学方式，引导学生成长为中国特色社会主义事业的合格建设者和可靠接班人。"  },
  // 体育类
  { id: 8, name: "体育 1", enName: "Physical Education 1", code: "231011001", category: "通识教育", subcategory: "体育类", nature: "必修", credit: 1, totalHours: "36 (讲授:28, 实践:8)", assessment: "考查", semester: 1, description: "《大学体育》是高校课程体系中的重要组成部分，是以提升学生运动能力、健康行为和体育品德为核心目标的公共必修课程。课程通过科学的体育教育和系统的体育锻炼，促进学生身心和谐发展，培养自觉锻炼的习惯与健康生活方式。同时注重体育道德、合作精神的培育，帮助学生形成终身体育意识，为全面发展奠定坚实基础。"  },
  { id: 9, name: "体育 2", enName: "Physical Education 2", code: "231011002", category: "通识教育", subcategory: "体育类", nature: "必修", credit: 1, totalHours: "36 (讲授:28, 实践:8)", assessment: "考查", semester: 2, description: "《大学体育》是高校课程体系中的重要组成部分，是以提升学生运动能力、健康行为和体育品德为核心目标的公共必修课程。课程通过科学的体育教育和系统的体育锻炼，促进学生身心和谐发展，培养自觉锻炼的习惯与健康生活方式。同时注重体育道德、合作精神的培育，帮助学生形成终身体育意识，为全面发展奠定坚实基础。"  },
  { id: 10, name: "体育 3", enName: "Physical Education 3", code: "231011003", category: "通识教育", subcategory: "体育类", nature: "必修", credit: 1, totalHours: "36 (讲授:28, 实践:8)", assessment: "考查", semester: 3, description: "《大学体育》是高校课程体系中的重要组成部分，是以提升学生运动能力、健康行为和体育品德为核心目标的公共必修课程。课程通过科学的体育教育和系统的体育锻炼，促进学生身心和谐发展，培养自觉锻炼的习惯与健康生活方式。同时注重体育道德、合作精神的培育，帮助学生形成终身体育意识，为全面发展奠定坚实基础。"  },
  { id: 11, name: "体育 4", enName: "Physical Education 4", code: "231011004", category: "通识教育", subcategory: "体育类", nature: "必修", credit: 1, totalHours: "36 (讲授:28, 实践:8)", assessment: "考查", semester: 4, description: "《大学体育》是高校课程体系中的重要组成部分，是以提升学生运动能力、健康行为和体育品德为核心目标的公共必修课程。课程通过科学的体育教育和系统的体育锻炼，促进学生身心和谐发展，培养自觉锻炼的习惯与健康生活方式。同时注重体育道德、合作精神的培育，帮助学生形成终身体育意识，为全面发展奠定坚实基础。"  },
  // 外语类
  { id: 12, name: "大学英语 1", enName: "College English 1", code: "230511001", category: "通识教育", subcategory: "外语类", nature: "必修", credit: 2, totalHours: "48", assessment: "考试", semester: 1, description: "《大学英语1》是面向全校本科生开设的公共必修课程，以培养学生英语综合应用能力与跨文化交际素养为核心目标。课程通过系统训练学生的听、说、读、写基本技能，提升其语言输出能力与自主学习水平，为通过大学英语四级考试及未来跨文化交流奠定基础。教学过程中注重融入中国优秀传统文化内容，助力学生树立文化自信与家国情怀。"  },
  { id: 13, name: "大学英语 2", enName: "College English 2", code: "230511002", category: "通识教育", subcategory: "外语类", nature: "必修", credit: 2, totalHours: "48", assessment: "考试", semester: 2, description: "《大学英语2》是面向非英语专业二年级本科生的公共必修课程，在《大学英语1》基础上进一步培养学生的英语综合应用能力与跨文化交际素养。课程通过系统训练学生的语言知识与技能，提升其在多元语境中进行有效沟通的能力，同时注重强化文化自信与家国情怀，为学生后续英语学习及未来发展的多维度需求奠定坚实基础。"  },
  { id: 14, name: "大学英语 3", enName: "College English 3", code: "230511003", category: "通识教育", subcategory: "外语类", nature: "必修", credit: 2, totalHours: "48", assessment: "考试", semester: 3, description: "《大学英语3》是面向非英语专业学生的公共基础必修课，旨在系统提升学生的英语学术应用能力与跨文化沟通素养。课程通过强化听说读写综合技能训练，帮助学生在学术与职业场景中有效运用英语进行交流，并深化对多元文化的理解。教学过程中注重本土意识与国际视野的融合，为学生成长为兼具文化自信与全球胜任力的新时代人才奠定基础。"  },
  { id: 15, name: "大学英语提高课程", enName: "Advanced College English", code: "无", category: "通识教育", subcategory: "外语类", nature: "限选", credit: 2, totalHours: "48", assessment: "考查", semester: 4, description: "《大学英语4》是面向非英语专业本科生的公共基础必修课程，旨在《大学英语3》基础上系统提升学生的英语综合应用能力与跨文化交际素养。课程通过深化语言知识教学与技能训练，培养学生在中高级语境中进行有效沟通的能力，同时强化文化自信与国际视野，为学生适应未来职业发展及参与全球交流奠定坚实基础。"  },
  // 军事 / 智慧 / 创业 / 通识理论
  { id: 16, name: "军事理论与国家安全", enName: "Military Theory & National Security", code: "231305001", category: "通识教育", subcategory: "军事理论类", nature: "必修", credit: 2, totalHours: "36 (讲授:24, 上机:12)", assessment: "考查", semester: 1, description: "《军事理论与国家安全》是面向高校学生的必修课程，以习近平强军思想和总体国家安全观为指导，旨在系统提升学生的国防素养与国家安全意识。课程通过讲授军事理论、安全形势与国防政策等内容，帮助学生掌握基本军事知识，增强家国情怀与责任担当。注重弘扬爱国主义精神，为培养国防后备力量、践行强军目标奠定坚实基础。"  },
  { id: 17, name: "计算思维导论", enName: "Computational Thinking", code: "230411003", category: "通识教育", subcategory: "智慧信息类", nature: "必修", credit: 1, totalHours: "16", assessment: "考查", semester: 2, description: "《计算思维导论》是面向非计算机专业本科生的通识教育选修课，旨在培养学生的计算思维素养与跨学科问题求解能力。课程通过讲授算法设计、程序执行与系统分析等内容，帮助学生掌握从实际问题抽象化到算法实现的基本方法，了解计算思维在数据化、网络化和智能化中的关键作用。同时注重培养学生严谨务实的信息素养，为各专业学生运用计算思维解决本领域问题奠定基础。"  },
  { id: 18, name: "职业生涯规划", enName: "Planning for Occupation", code: "233201001", category: "通识教育", subcategory: "创业就业类", nature: "必修", credit: 1, totalHours: "22 (讲授:16, 上机:6)", assessment: "考查", semester: 1, description: "《职业生涯规划》是面向全校大一学生的通识教育课程，旨在帮助学生系统掌握职业生涯规划的理论与方法，树立科学的职业发展观。课程通过自我认知、职业探索与规划实践等环节，引导学生将个人发展同国家需要、社会需求有机结合，制定切实可行的学业与职业发展方案。注重培养学生的自主规划意识与终身学习能力，为其实现全面可持续发展奠定基础。"  },
  { id: 19, name: "就业创业指导", enName: "Intro to Employment & Entrepreneurship", code: "233201002", category: "通识教育", subcategory: "创业就业类", nature: "必修", credit: 1, totalHours: "16 (讲授:10, 上机:6)", assessment: "考查", semester: 6, description: "《就业创业指导》是面向全校大三学生的通识教育课程，旨在帮助学生掌握就业政策、求职方法与职业发展策略。课程通过分析就业形势、解读国家政策及开展求职实践，引导学生树立将个人发展融入国家需要的就业观，提升职业素养与就业竞争力。注重培养学生的自主择业能力与职业规划意识，为其实现高质量就业和职业发展奠定基础。"  },
  { id: 20, name: "航空航天概论", enName: "Intro to Aeronautics & Astronautics", code: "230612001", category: "通识教育", subcategory: "通识理论类", nature: "必修", credit: 1, totalHours: "16", assessment: "考查", semester: 2, description: "《航空航天概论》是面向航空院校学生的通识教育必修课，旨在系统介绍航空航天基础知识，激发学生航空兴趣与报国情怀。课程通过讲解飞行原理、飞机结构、航空技术及发展历程，帮助学生建立航空航天学科基础认知，并融合实践教学培养学生的创新思维。注重弘扬爱国主义精神，引导学生树立“航空报国”的远大志向，为未来从事航空航天事业奠定基础。"  },
  { id: 21, name: "大学生劳动教育", enName: "Labor Education", code: "232501001", category: "通识教育", subcategory: "通识理论类", nature: "必修", credit: 1, totalHours: "16", assessment: "考查", semester: 2, description: "《大学生劳动教育》是面向全校本科新生的通识教育必修课程，旨在帮助学生树立马克思主义劳动观，弘扬劳动精神、劳模精神与工匠精神。课程通过系统讲授劳动价值观、劳动安全、劳动关系等模块，引导学生理解劳动创造价值的意义，培养勤俭奋斗、创新奉献的劳动品质，为形成良好劳动习惯、提升综合劳动素养奠定基础。"  },
  { id: 22, name: "大学生心理健康教育", enName: "Psychological Health Education", code: "233202001", category: "通识教育", subcategory: "通识理论类", nature: "必修", credit: 1, totalHours: "16 (讲授:10, 上机:6)", assessment: "考查", semester: 1, description: "《大学生心理健康教育》是面向全体大一新生的通识教育必修课程，旨在帮助学生掌握心理健康知识，提升心理调适能力，促进全面发展和人格健全。课程围绕大学生常见的自我认知、学习适应、情绪管理等心理议题，通过知识讲授、心理体验与行为训练等多种方式，引导学生树立积极心态和正向价值观，为健康成长与全面发展奠定心理基础。"  },
  { id: 23, name: "创新创业导论", enName: "Innovation and Entrepreneurship", code: "232601001", category: "通识教育", subcategory: "通识理论类", nature: "必修", credit: 1, totalHours: "16 (讲授:8, 实践:8)", assessment: "考查", semester: 3, description: "《创新创业导论》是面向全校各专业学生的通识教育课程，旨在系统培养学生的创新思维、创业意识与实践能力。课程通过讲授创新方法、创业流程及商业计划撰写等内容，结合团队组建、项目路演等实践环节，帮助学生掌握创新创业的核心知识与技能。注重培育学生敢为人先的创新精神与团队协作素养，引导其将个人发展与社会需求相结合，为未来实现岗位创新或自主创业奠定基础。" },
  // 通识选修
  { id: 24, name: "自然科技与技术进步：项目管理", enName: "Project Management", code: "TXZJ00012", category: "通识教育", subcategory: "选修类", nature: "限选", credit: 1, totalHours: "16", assessment: "考查", semester: 5, description: "《项目管理》是面向理工科专业开设的理论与技术并重的选修课程，系统讲授现代项目管理的核心理论、方法及全流程关键环节。课程通过系统教学与案例分析，帮助学生掌握项目启动、计划、执行到收尾各阶段的管理要点，培养其项目统筹与问题解决能力，同时注重工程伦理与职业操守的塑造，为未来从事项目管理工作奠定扎实基础。"  },
  { id: 25, name: "艺术鉴赏与技艺训练", enName: "Art Appreciation", code: "无", category: "通识教育", subcategory: "选修类", nature: "限选", credit: 2, totalHours: "32", assessment: "考查", semester: 3 },
  { id: 26, name: "语言表达与沟通交流", enName: "Communication", code: "无", category: "通识教育", subcategory: "选修类", nature: "限选", credit: 2, totalHours: "32", assessment: "考查", semester: 6 },
  { id: 27, name: "生态文明与生命健康：环境与可持续发展", enName: "Eco-civilization", code: "TXSS00019", category: "通识教育", subcategory: "选修类", nature: "限选", credit: 1, totalHours: "16", assessment: "考查", semester: 4, description: "《环境与可持续发展》是一门面向全校本科生的多学科交叉通识课程，旨在系统阐释可持续发展的理论基础与实践路径。课程通过分析全球性环境问题与可持续发展内涵，帮助学生树立正确的自然观与发展观，掌握工程实践中的可持续性评价方法。注重培养学生的环境责任感与系统思维，引导其在未来专业领域中践行生态文明理念，服务绿色发展需求。"  },

  // --- 二、数学与自然科学 ---
  { id: 28, name: "高等数学 B1", enName: "Advanced Mathematics B1", code: "230711003", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 5, totalHours: "80", assessment: "考试", semester: 1, description: "《高等数学B1》是理工科各专业的公共基础必修课程，系统讲授一元函数微积分与极限理论的核心知识与运算方法。课程通过理论教学与能力训练，培养学生的数学思维、逻辑推演及初步建模能力，为其学习后续数学与专业课程奠定坚实基础。同时注重培育严谨的科学态度与理论联系实际的素养，提升学生运用数学工具解决实际问题的综合能力。"  },
  { id: 29, name: "高等数学 B2", enName: "Advanced Mathematics B2", code: "230711004", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 5, totalHours: "80", assessment: "考试", semester: 2, description: "《高等数学B2》是理工科各专业的公共基础必修课程，系统讲授多元函数微积分、微分方程、向量代数与无穷级数等核心内容。课程通过理论教学与运算训练，深化学生的数学分析能力与抽象思维能力，培养其运用多元数学工具解决实际问题的综合素养。注重培育严谨的科学态度与建模能力，为后续专业课程学习及工程应用奠定坚实数学基础。"  },
  { id: 30, name: "线性代数 A", enName: "Linear Algebra", code: "230711005", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 2.5, totalHours: "40", assessment: "考试", semester: 2, description: "《线性代数A》是理工科专业的重要基础必修课程，系统讲授矩阵理论、线性方程组、向量空间及特征值等核心内容与计算方法。课程通过理论教学与逻辑训练，培养学生的抽象思维能力、代数推理能力及数学建模素养，使其掌握运用线性代数工具解决多学科问题的核心技能。注重培育严谨的治学态度与科学分析能力，为后续专业课程学习及科研创新奠定代数基础。"  },
  { id: 31, name: "大学物理 C", enName: "University Physics C", code: "230811005", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 4, totalHours: "64", assessment: "考试", semester: 2, description: "《大学物理C》是面向非物理专业本科生的基础课程，系统讲授物理学基本概念、原理及其在现代科技中的应用。课程通过物理思想方法与科学史相结合的教学方式，培养学生的科学思维、分析能力与科学素养，帮助其建立辩证唯物主义世界观。注重物理原理与工程实际的联系，为学生后续专业课程学习及终身发展奠定必要基础。"  },
  { id: 32, name: "大学计算机基础训练", enName: "College Computer Basic Training", code: "230411001", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 1, totalHours: "32 (讲授:16, 上机:16)", assessment: "考查", semester: 2, description: "《大学计算机基础训练》是面向非计算机专业本科生的基础实践课程，系统讲授计算机基础理论及常用办公软件的核心应用技能。课程通过理论教学与实操训练相结合，帮助学生掌握计算机系统、网络知识及主流办公工具，培养其信息处理能力与网络安全意识。注重数据安全素养的培育，为学生后续专业软件学习及信息化应用奠定坚实基础。"  },
  { id: 33, name: "概率论与数理统计", enName: "Probability & Statistics", code: "230711010", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 3, totalHours: "48", assessment: "考试", semester: 3, description: "《概率论与数理统计》是理工经管类各专业的重要基础理论课程，系统讲授随机现象规律分析的基本理论与方法。课程通过概率模型、统计推断等核心内容的教学，培养学生理解随机性问题、运用数理工具解决实际应用的能力。注重结合数学史与科学案例培育学生的科学精神与责任担当，为专业学习与研究提供随机数学基础。"  },
  { id: 34, name: "自然地理学", enName: "Physiography", code: "231104001", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 4, description: "《自然地理学》是智慧建筑与建造、交通工程专业的学科教育课程，系统讲授自然地理环境各要素的相互关系、空间分异规律及人地互动机制。课程通过分析自然地理环境的整体性与分区特征，帮助学生建立人与自然和谐共生的可持续发展理念，掌握建筑工程与地理环境协调发展的分析与评价方法，为专业学习与工程实践提供地理学基础。"  },
  { id: 35, name: "环境生态学概论 A", enName: "Intro to Environmental Ecology A", code: "231104003", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 5, description: "《环境科学概论》是智慧建筑与建造专业的自然科学通识课程，系统阐释环境问题的产生机制、人类活动与自然环境的相互作用及可持续发展理论。课程通过分析环境与人类发展的关系，帮助学生建立环境保护意识，掌握建筑工程中的环境影响评价与资源优化方法，为培养具备环境责任感的建筑领域专业人才奠定科学基础。"  },
  { id: 36, name: "数值计算方法 A", enName: "Numerical Calculation Method A", code: "231104004", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 6, description: "《数值计算方法A》是智慧建筑与建造专业的基础必修课程，系统讲授基于计算机的数值计算理论与工程问题建模求解方法。课程通过算法设计与程序实现训练，培养学生掌握数值分析的核心思想，具备对复杂工程问题建立数学模型并运用数值算法求解的能力。注重培育严谨求实的科学态度，为从事智慧建造领域的科学计算与研究奠定基础。"  },

  // --- 三、工程基础与实践 ---
  { id: 37, name: "建筑工程制图", enName: "Architectural Engineering Drawings", code: "231104005", category: "工程基础", subcategory: "基础", nature: "必修", credit: 3.5, totalHours: "56", assessment: "考试", semester: 1, description: "《建筑工程制图》是智慧建筑与建造、土木工程等相关专业的学科基础课程，系统讲授工程图样绘制与识读的原理方法及国家标准。课程通过投影理论、施工图表达与计算机绘图等教学内容，培养学生空间思维能力与工程图纸表达能力，为其开展建筑设计、专业实训及毕业设计提供技术基础，同时注重结合国家战略引导学生树立行业报国情怀。"  },
  { id: 38, name: "工程认识训练 A", enName: "Training for Engineering Cognition A", code: "233101001", category: "工程基础", subcategory: "基础", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 2, description: "《工程认识训练A》是面向工科学生的工程启蒙实践课程，旨在通过工程现场认知与基础训练，帮助学生建立宏观工程概念和系统思维。课程通过介绍产品制造流程、工程技术应用及工程师素养要求，引导学生树立质量安全意识和工匠精神，激发工程报国志向，为后续专业学习与工程实践奠定基础。"  },

  // --- 四、专业基础课程 ---
  { id: 39, name: "智慧建筑导论", enName: "Introduction of Smart Buildings", code: "231104006", category: "专业基础", subcategory: "基础", nature: "必修", credit: 1, totalHours: "16", assessment: "考试", semester: 1, description: "《智慧建筑导论》是面向大一学生的专业基础课程，系统阐述智慧建筑的基本概念、关键技术与发展路径。课程通过理论讲授与案例分析，帮助学生掌握物联网、大数据等技术在建筑中的应用，培养其创新思维与工程伦理意识。注重引导学生认识建筑行业的社会责任与可持续发展使命，为后续专业学习与职业发展奠定基础。"  },
  { id: 40, name: "素描", enName: "Sketch", code: "231104007", category: "专业基础", subcategory: "美术基础", nature: "必修", credit: 1.5, totalHours: "24", assessment: "考查", semester: 1, description: "《素描》是智慧建筑与建造专业的重要学科基础必修课程，旨在培养学生的美术技法、造型能力及专业绘画素养。课程通过系统讲授素描理论与创作方法，帮助学生掌握造型规律与空间表达，融合艺术感知与设计思维，为其后续建筑设计等专业课程的学习奠定坚实的造型基础与美学素养。"  },
  { id: 41, name: "色彩", enName: "Color", code: "231104008", category: "专业基础", subcategory: "美术基础", nature: "必修", credit: 1.5, totalHours: "24", assessment: "考查", semester: 2, description: "《色彩》是智慧建筑与建造专业的学科基础必修课程，系统讲授色彩理论与应用方法，培养学生的色彩感知、搭配与表现能力。课程通过色彩规律探索与绘画实践，帮助学生掌握色彩在设计表达中的运用，融合美学素养与设计思维，为其后续建筑设计等专业课程的学习奠定坚实的色彩基础与创作能力。"  },
  { id: 42, name: "建筑初步", enName: "Preliminary Building", code: "231104009", category: "专业基础", subcategory: "设计基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 3, description: "《建筑初步》是智慧建筑与建造专业的专业基础课程，系统讲授建筑基本理论与设计方法，通过渐进式设计训练培养学生的专业基础技能与设计思维。课程帮助学生掌握建筑设计表现技法，了解建筑本质与中外传统建筑特征，为其后续专业课程学习及工程实践奠定必要的理论基础与设计能力。"  },
  { id: 43, name: "建筑美术", enName: "Architectural Art", code: "231104010", category: "专业基础", subcategory: "美术基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考查", semester: 3, description: "《建筑美术》是智慧建筑与建造专业的学科专业基础课程，系统讲授建筑造型规律与艺术表现方法，培养学生的专业审美能力与形式表达能力。课程通过分析建筑艺术语言与文化价值，帮助学生理解建筑的象征性与时代感，为其建立系统的建筑美学认知，为成长为具备艺术素养与职业责任的建筑工程师奠定基础。"  },
  { id: 44, name: "智能测绘", enName: "Smart Mapping", code: "231104011", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 3.5, totalHours: "56 (讲授:40, 实验:16)", assessment: "考试", semester: 4, description: "《智能测绘》是智慧建筑与建造专业的重要专业基础课程，系统讲授现代工程测量的基础理论、仪器操作及前沿技术应用。课程通过水准测量、坐标测量、三维扫描等实验教学，培养学生掌握测绘数据分析与工程测量方案制定能力，同时注重培育工匠精神与团队协作素养，为从事工程测量、设计与项目管理等工作奠定技术基础。"  },
  { id: 45, name: "智慧建筑工程 CAD 制图", enName: "Smart Building Eng CAD", code: "231104012", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2.0, totalHours: "32 (上机:32)", assessment: "考查", semester: 4, description: "《智慧建筑工程CAD制图》是智慧建筑与建造、土木工程等相关专业的重要学科基础课程，系统讲授AutoCAD与天正建筑等专业软件的绘图原理与实操技能。课程通过软件操作、施工图绘制及建筑信息模型构建等教学内容，培养学生掌握建筑施工图的数字化表达与技术实现能力，为其开展建筑设计、专业实训及毕业设计提供技术支撑，同时注重培育严谨规范的职业素养与信息管理能力。"  },
  { id: 46, name: "BIM 基础与应用", enName: "BIM Fundamentals", code: "231104063", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 1.5, totalHours: "24 (上机:24)", assessment: "考查", semester: 4, description: "《BIM基础与应用》是智慧建筑与建造专业的重要专业基础课程，以企业职业能力需求为导向，通过住宅项目案例系统讲授Revit建模技术与建筑信息模型应用。课程采用“做中学”模式，培养学生掌握参数化建模、三维构件设计及BIM数据管理能力，为其参与智慧建筑项目、实现建筑设计智能化发展奠定技术基础，同时注重培育规范严谨的职业素养。"  },
  { id: 47, name: "建筑力学与建筑结构", enName: "Building Mechanics & Structure", code: "231104013", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 4, totalHours: "64 (讲授:62, 上机:2)", assessment: "考试", semester: 5, description: "《建筑力学与建筑结构》是智慧建筑与建造专业的重要专业基础课程，系统讲授建筑结构受力分析、变形计算与设计原理。课程通过静力学、结构内力计算及钢筋混凝土构件设计等教学内容，培养学生掌握建筑力学分析与结构设计能力，为其从事建筑设计与工程建造提供理论基础，同时注重培育工程伦理意识与社会责任担当。"  },
  { id: 48, name: "Python 程序设计", enName: "Python Programming", code: "231104014", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "40 (讲授:24, 实验:16)", assessment: "考试", semester: 6, description: "《Python程序设计》是智慧建筑与建造专业的专业基础课程，系统讲授Python语法、面向对象编程及文件操作等核心内容。课程通过理论教学与上机实践相结合，培养学生掌握编程思维与Python技术应用能力，为其在智慧建筑领域进行数据分析、系统开发及问题求解奠定基础，同时注重培育严谨求实的工匠精神与社会责任意识。"  },
  
  // --- 五、专业教育课程 ---
  // 专业核心
  { id: 49, name: "智慧建筑设计原理", enName: "Digital Architectural Design", code: "231104015", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 3, totalHours: "48", assessment: "考试", semester: 4, description: "《智慧建筑设计原理》是智慧建筑与建造专业的核心课程，系统阐释智慧建筑的设计标准、系统交互与整体设计流程。课程通过理论教学与上机实践，培养学生掌握智慧建筑需求分析与系统设计能力，能够制定科学可行的建筑设计方案，为未来从事智慧建筑研究与实践奠定基础，同时注重培育工程伦理意识与可持续发展理念。"  },
  { id: 50, name: "中外建筑史", enName: "Chinese and Foreign Arch History", code: "231104016", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 4, totalHours: "64", assessment: "考试", semester: 5, description: "《中外建筑史》是智慧建筑与建造专业的综合性基础课程，系统阐述中外建筑发展脉络及其与社会、文化、技术的互动关系。课程通过分析不同历史时期建筑特征与演变规律，帮助学生建立物质与精神文明相结合的建筑观，培养历史思维与创新意识，为其专业学习及建筑实践提供历史视野与文化底蕴。"  },
  { id: 51, name: "建筑构造", enName: "Building Construction", code: "231104017", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 5, description: "《建筑构造》是智慧建筑与建造专业的专业核心课程，系统讲授建筑组成部分的构造原理与设计方法。课程通过整合结构选型、材料应用及施工技术等知识，培养学生掌握建筑构造设计的综合能力，巩固工程图绘制与实践应用技能，为其从事建筑设计及工程实践提供专业技术支撑，同时注重培育可持续发展理念与工程责任意识。"  },
  { id: 52, name: "人工智能与算法设计", enName: "AI and Algorithm Design", code: "231104018", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32 (讲授:16, 实验:16)", assessment: "考试", semester: 6, description: "《人工智能与算法设计》是智慧建筑与建造等专业的专业核心课程，系统讲授人工智能的基本理论、算法框架及其在工程领域的应用。课程通过Python实现机器学习、神经网络等智能算法，培养学生运用人工智能方法分析解决工程问题的能力，为其在智慧建筑与建造领域应用前沿智能技术奠定基础，同时注重培育严谨求实的科学态度与探索精神。"  },
  { id: 53, name: "智能建造与运维", enName: "Intel Construction & O&M", code: "231104019", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 6, description: "《智能建造与运维》是智慧建筑与建造专业的专业核心课程，系统讲授智能建造理论与运维技术，融合人工智能、大数据及物联网等先进技术方法。课程通过理论与实践相结合，培养学生运用智能技术提升工程效率、优化运维管理的能力，为其从事智慧建筑全生命周期设计、施工与运维工作奠定基础，同时注重培育技术创新意识与社会责任担当。"  },
  { id: 54, name: "公共建筑设计原理", enName: "Principles of public building design", code: "231104020", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 3, totalHours: "48", assessment: "考试", semester: 6, description: "《公共建筑设计原理》是智慧建筑与建造专业的理论核心课程，系统阐释公共建筑设计的基本理论、方法及综合决策要素。课程通过讲授适用、经济、美观等设计原则，培养学生掌握建筑设计全过程的思维方法与评价能力，为其后续设计课程学习与专业能力提升奠定理论基础，同时注重培育工程伦理意识与社会责任担当。"  },
  { id: 55, name: "建筑经济", enName: "Construction Economics", code: "231104021", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 7, description: "《建筑经济》是智慧建筑与建造专业的重要专业核心课程，系统讲授建筑技术经济评价原理、资金时间价值及项目投资决策方法。课程通过经济分析、方案比选与风险评估等教学内容，培养学生建立经济观点并掌握工程经济效益评价能力，为其在建筑设计中实现技术经济优化决策提供理论支撑，同时注重培育科学严谨的分析态度与社会责任意识。"  },
  { id: 56, name: "数字化施工", enName: "Digital Construction", code: "231104022", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32 (讲授:24, 实践:8)", assessment: "考试", semester: 7, description: "《数字化施工》是智慧建筑与建造专业的专业核心课程，系统讲授数字化建造框架、工程大数据分析及智能施工技术应用。课程通过理论与实践相结合，培养学生掌握建筑施工全过程的数字化管理能力，探索绿色化、工业化与信息化融合的建造路径，为其从事智慧建筑设计与施工运维提供技术支撑，同时注重培育科技伦理意识与行业转型责任感。"  },
  // 专业拓展 (限选/任选)
  { id: 57, name: "可持续住宅设计原理", enName: "Sustainable Home Design", code: "231104037", category: "专业教育", subcategory: "拓展课程", nature: "限选", credit: 2, totalHours: "32", assessment: "考试", semester: 3, description: "《可持续住宅设计原理》是智慧建筑与建造专业的重要专业拓展课程，系统讲授可持续住宅设计的核心理论与设计方法。课程通过住宅套型设计、高低层住宅设计及外部空间环境设计等教学内容，培养学生掌握可持续设计思维与实践能力，为其在职业实践中推动建筑行业可持续发展奠定基础，同时注重培育跨文化视野与社会责任感。"  },
  { id: 58, name: "智慧建筑与建造设计原理", enName: "Smart Building & Construction Design", code: "231104024", category: "专业教育", subcategory: "拓展课程", nature: "限选", credit: 2, totalHours: "32", assessment: "考试", semester: 5, description: "《智慧建筑与建造设计》是面向建筑学、土木工程等相关专业的高级课程，系统阐释智慧建筑的设计原理、技术体系与实践方法。课程通过案例分析、项目实践及软件工具运用，培养学生掌握智慧建筑设计全流程能力，能够制定技术方案并进行评估分析，为其在建筑与城市规划领域开展创新实践奠定基础，同时注重培育工程伦理意识与跨学科协作能力。"  },
  { id: 59, name: "智能建造技术与应用", enName: "Intel Construction Tech & App", code: "231104025", category: "专业教育", subcategory: "拓展课程", nature: "限选", credit: 2, totalHours: "32", assessment: "考试", semester: 6, description: "《智能建造技术与应用》是智慧建筑与建造专业的重要专业拓展课程，系统讲授智能建造的核心理论与技术应用体系。课程通过BIM、物联网等先进技术的教学与实践，培养学生掌握工程项目全生命周期的智能管理能力，为其从事智慧建筑设计与施工运维工作奠定技术基础，同时注重培育终身学习能力与行业创新意识。"  },
  { id: 60, name: "BIM 应用与项目管理", enName: "BIM App & Project Mgmt", code: "231104026", category: "专业教育", subcategory: "拓展课程", nature: "限选", credit: 2, totalHours: "32", assessment: "考试", semester: 6, description: "《BIM应用与项目管理》是智慧建筑与建造专业的专业拓展课程，系统讲授BIM技术在工程项目全生命周期的应用与管理方法。课程通过设计、施工、运维各阶段的BIM技术实践，培养学生掌握基于BIM的工程管理能力与决策分析方法，为其从事智慧建筑项目开发与管理奠定基础，同时注重培育工匠精神与团队协作意识。"  },
  { id: 61, name: "建筑专业英语", enName: "English for Architecture", code: "231104023", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 5, description: "《建筑专业英语》是智慧建筑与建造专业的专业任选课程，旨在提升学生阅读和翻译本专业英语文献的能力。课程通过专业术语学习、翻译技巧训练及专业文献阅读，帮助学生掌握建筑工程领域的英语应用能力，为其参与国际工程项目与学术交流奠定语言基础，同时注重培育跨文化沟通意识与国际视野。"  },
  { id: 62, name: "建筑设备", enName: "Construction Equipment", code: "231104027", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 4, description: "《建筑设备》是智慧建筑与建造专业的重要专业拓展课程，系统讲授建筑给排水、暖通空调、建筑电气及智能建筑设备等核心系统的原理与应用。课程通过理论教学与技术分析，帮助学生掌握建筑设备工作原理与图纸识读能力，为其从事建筑工程设计与设备管理奠定专业基础，同时注重培育严谨的科学态度与团队协作精神。"  },
  { id: 63, name: "建筑施工组织与技术", enName: "Construction Org & Tech", code: "231104028", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5, description: "《建筑施工组织与技术》是智慧建筑与建造专业的重要专业拓展课程，系统讲授建筑工程施工技术、施工组织原理及现代工程管理方法。课程通过工艺分析、案例研讨与组织设计等教学环节，培养学生掌握施工流程优化与现场管理能力，为其从事建筑设计、施工组织与项目管理等工作奠定基础，同时注重培育工程伦理意识与社会责任感。"  },
  { id: 64, name: "智慧城市", enName: "Smart City", code: "231104029", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5, description: "《智慧城市》是智慧建筑与建造专业的重要拓展课程，系统阐释智慧城市的概念特征、信息基础设施及政策标准体系。课程通过分析智慧政务、产业与民生等应用领域，帮助学生掌握智慧城市建设流程与评价方法，为其在城市建设中运用系统性思维奠定基础，同时注重培育可持续发展理念与工程责任意识。"  },
  { id: 65, name: "建设法规 B", enName: "Construction Regulation B", code: "231104030", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 7, description: "《建设法规B》是面向土木工程等相关专业的专业拓展课程，系统阐释建设工程领域法律法规体系及其应用。课程通过法规解析与案例分析，帮助学生掌握建设法规的基本内容与适用方法，培养其依法开展工程实践的意识和能力，同时注重培育法治观念与职业责任感。"  },
  { id: 66, name: "BIM 标准 A", enName: "Introduction of BIM A", code: "231104031", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 4, description: "《BIM标准A》是面向工程管理与智慧建筑与建造专业的专业任选课程，系统介绍BIM技术的基础理论、实施框架与前沿应用。课程通过BIM知识体系、软件工具及多阶段应用等内容的教学，帮助学生建立对BIM工程师职业的系统认知，为其深入掌握BIM技术奠定基础，同时注重培育工匠精神与技术报国情怀。"  },
  { id: 67, name: "建筑物理", enName: "Building Physics", code: "231104032", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 3, description: "《建筑物理》是智慧建筑与建造专业的重要专业拓展课程，系统讲授建筑热环境与声环境的理论基础、评价方法及设计标准。课程通过理论与实践相结合的教学方式，帮助学生掌握物理环境分析与优化技能，培养以人为本、绿色环保的设计理念，为其在建筑设计中创造健康舒适的人居环境奠定专业基础。"  },
  { id: 68, name: "日光与建筑", enName: "Daylight and Architecture", code: "231104033", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 5, description: "《日光与建筑》是智慧建筑与建造专业的重要专业拓展课程，系统讲授建筑光环境的理论基础、评价方法及设计标准。课程通过理论与实践相结合的教学方式，帮助学生掌握光环境分析与优化技能，培养以人为本、绿色环保的设计理念，为其在建筑设计中创造健康舒适的光环境奠定专业基础。"  },
  { id: 69, name: "场地规划设计", enName: "Site Planning and Design", code: "231104034", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2.0, totalHours: "32", assessment: "考查", semester: 7, description: "《场地规划设计》是智慧建筑与建造专业的重要专业拓展课程，系统讲授场地规划的基本原理、分析方法与工程应用。课程通过理论教学与实践训练，培养学生掌握建筑项目与场地环境的协调设计能力，能够在规划中综合考虑安全、生态、文化等多元因素，为其成为新型复合型建筑师奠定基础，同时注重培育可持续发展理念与社会责任感。"  },
  { id: 70, name: "建筑文化生态学", enName: "Architectural Cultural Ecology", code: "231104035", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "24", assessment: "考查", semester: 3, description: "《建筑文化生态学》是智慧建筑与建造专业的重要专业拓展课程，系统阐释建筑与生态环境的互动关系及可持续发展设计方法。课程通过生态配置、水环境系统及生态设计等教学内容，帮助学生掌握生态建筑流程与评价标准，培养其融合文化传承与生态理念的设计能力，为塑造人与自然和谐的建筑环境奠定专业基础。"  },
  { id: 71, name: "建筑新材料", enName: "New Building Materials", code: "231104036", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 4, description: "《建筑新材料》是智慧建筑与建造专业的专业拓展课程，系统介绍建筑材料的工程特性、应用场景及前沿发展。课程通过材料性能分析与工程实践案例，帮助学生掌握新型建筑材料的选用原则与可持续应用方法，为其在建筑设计与工程建造中实现资源优化与技术创新奠定基础。"  },
  { id: 72, name: "绿色建筑与可持续建设管理", enName: "Green Building & Mgmt", code: "231104038", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 7, description: "《绿色建筑与可持续建设管理》是面向工程管理与智慧建筑与建造专业的专业任选课程，系统阐释绿色建筑理念、全寿命周期管理及可持续发展策略。课程通过设计管理、施工运营及评价体系等教学内容，帮助学生建立绿色建筑系统思维，掌握资源节约与环境友好的工程管理方法，为培养具备可持续发展视野的专业人才奠定基础。"  },
  { id: 73, name: "智慧建筑全球化发展概论", enName: "Global Smart Buildings Dev", code: "231104039", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 3, description: "《智能建筑全球化发展概论》是智慧建筑与建造专业的重要专业拓展课程，系统阐释智能建筑的组成结构、工作原理及全球化发展趋势。课程通过分析可再生能源应用与系统集成等关键内容，帮助学生掌握智能建筑的基本特征与发展动态，培养其全球化视野与跨文化工程实践能力，为参与国际智能建筑项目奠定基础。"  },
  { id: 74, name: "装配式建筑技术与创新实践", enName: "Prefabricated Building Tech", code: "231101065", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "40 (讲授:8, 实践:32)", assessment: "考查", semester: 3, description: "《装配式建筑技术与创新实践》是面向土木工程与智慧建筑与建造专业的重要实践课程，通过设计实训、工艺参观与模型制作等环节，系统培养学生掌握装配式建筑设计、生产与施工的全流程能力。课程注重现代软件工具应用与工匠精神培育，帮助学生深入理解装配式建筑在行业转型与可持续发展中的价值，为其从事专业实践与创新工作奠定基础。"  },
  { id: 75, name: "楼宇智能系统", enName: "Building Intelligence System", code: "231101050", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 4, description: "《楼宇智能系统》是智慧建筑与建造专业的重要专业拓展课程，系统阐释智能楼宇的子系统构成、布线系统设计与集成管理方法。课程通过理论与实践相结合的教学方式，帮助学生掌握建筑智能化系统的设计实施与运维管理能力，为其从事智能建筑系统建设与维护工作奠定专业技术基础，同时注重培育资源优化配置与可持续发展意识。"  },
  { id: 76, name: "城市规则原理 A", enName: "Principles of Urban Planning A", code: "231104040", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2.0, totalHours: "32", assessment: "考查", semester: 6, description: "《城市规划原理》是智慧建筑与建造专业的重要专业拓展课程，系统阐释城市规划的基本理论、设计方法及编制体系。课程通过分析城市经济、社会与环境等多维要素，帮助学生建立系统的城市规划思维，掌握解决城市发展问题的综合能力，为其未来从事城市规划与设计工作奠定理论基础，同时注重培育可持续发展理念与社会责任感。"  },
  { id: 77, name: "建筑与新媒体", enName: "Architecture and New Media", code: "231104041", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 3, description: "《建筑与新媒体》是智慧建筑与建造专业的重要专业拓展课程，系统探讨新媒体技术与建筑设计的融合理论与方法。课程通过技术学习与创作实践，培养学生掌握媒体与建筑交叉领域的创新表达能力，拓宽其设计思维与审美视野，为未来开展数字化建筑创作奠定基础，同时注重培育科技伦理意识与社会责任感。"  },
  { id: 78, name: "数字化设计前沿", enName: "Frontiers of Digital Design", code: "231104042", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 4, description: "《数字化设计前沿》是智慧建筑与建造专业的重要专业任选课程，系统讲授BIM技术、人工智能建造及数字化施工等前沿设计方法。课程通过理论教学与技术应用，培养学生掌握建筑数字化设计的核心原理与实践能力，为其在建筑设计与工程管理中运用数字化技术奠定基础，同时注重培育自主创新意识与终身学习能力。"  },
  { id: 79, name: "大数据管理", enName: "Big Data Management", code: "231104043", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 5, description: "《大数据管理》是智慧建筑与建造、土木工程等多专业的专业拓展课程，系统阐释大数据管理的概念体系、工程流程及行业应用。课程通过数据生命周期、隐私治理及工程方法等教学内容，帮助学生掌握大数据分析与管理的核心方法，为其在专业领域运用数据科学解决问题奠定基础，同时注重培育数据安全意识与科学创新精神。"  },
  { id: 80, name: "传感与物联网技术", enName: "Sensing and IoT Technology", code: "231104044", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 7, description: "《传感与物联网技术》是智慧建筑与建造、土木工程等多专业的专业拓展课程，系统阐释物联网体系架构、传感器技术与信息系统等核心理论。课程通过技术分析与应用场景解读，培养学生掌握物联网系统构建与工程分析能力，为其在智慧建筑等领域应用物联网技术奠定基础，同时注重培育团队协作精神与科技报国情怀。"  },
  { id: 81, name: "智慧建筑与 VR", enName: "Smart Building and VR", code: "231104045", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 7, description: "《智慧建筑与VR》是智慧建筑与建造、土木工程等专业的重要专业课程，系统阐释智慧建筑理论与虚拟现实技术的交叉融合与应用开发。课程通过C#编程、Unity3D等工具教学，培养学生掌握VR系统开发技能，能够将虚拟现实技术应用于智慧建筑领域，为其从事相关技术研发奠定基础，同时注重培育科技伦理意识与社会责任感。"  },
  { id: 82, name: "机场净空智慧技术与管理", enName: "Airport Clearance Tech", code: "231104046", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5, description: "《机场净空智慧技术与管理》是智慧建筑与建造、土木工程等多专业的专业拓展课程，系统阐释机场净空管理的技术标准、电磁环境保护及智慧化管理方法。课程通过障碍物限制分析、净空法规解读等教学内容，帮助学生掌握机场净空工程的核心知识与分析方法，为民航安全建设与管理培养专业人才，同时注重培育安全意识与民航报国情怀。"  },
  { id: 83, name: "机场建设工程项目管理", enName: "Airport Project Mgmt", code: "231104047", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 6, description: "《机场建设工程项目管理》是工程管理专业的基础平台课程，系统讲授工程项目管理的核心理论与投资、进度、质量三大控制方法。课程通过项目策划、风险管控及信息化管理等教学内容，帮助学生建立完整的项目管理知识体系，培养其解决机场建设实际问题的综合能力，为培养懂技术、善管理的高级复合型人才奠定基础。"  },
  { id: 84, name: "机场道路与交通智能规划", enName: "Airport Traffic Planning", code: "231104048", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 6, description: "《机场道路与交通智能规划》是智慧建筑与建造专业的专业任选课程，系统介绍航空运输体系构成、机场规划方法及工程设计要求。课程通过机场功能区设计、道面结构与排水系统等教学内容，培养学生掌握机场规划与工程设计能力，为其未来从事航空运输基础设施建设奠定基础，同时注重培育自主研学能力与行业报国情怀。"  },
  { id: 85, name: "机场建筑设计原理", enName: "Airport Arch Design Principle", code: "231104049", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 6, description: "《机场建筑设计原理》是智慧建筑与建造专业的重要专业课程，系统阐释机场建筑的功能布局、流程设计及与周边环境的协调原则。课程通过理论教学与实践操作相结合，培养学生掌握机场航站区规划、空侧容量设计等核心能力，为民航基础设施建设输送专业人才，同时注重培育民航精神与时代担当意识。"  },
  { id: 86, name: "建筑环境交互原理", enName: "Built Environment Interaction", code: "231104050", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 7, description: "《建筑环境交互原理》是智慧建筑与建造专业的重要专业拓展课程，系统阐释建筑室内外环境与人体健康舒适的交互关系及设计方法。课程通过热湿环境分析、空气品质控制等教学内容，帮助学生掌握健康人居环境的设计理论与评价标准，为其开展毕业设计及从事健康建筑实践奠定专业基础，同时注重培育可持续发展理念与人文关怀意识。"  },

  // --- 六、专业实践课程 ---
  { id: 87, name: "建筑专业认知实习", enName: "Cognitive Internship", code: "231104051", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 2, description: "《建筑专业认知实习》是智慧建筑与建造专业的重要实践教学环节，旨在通过现场参观、企业体验等方式增进学生对建筑行业的感性认识与专业理解。实习内容涵盖建筑类型认知、前沿技术了解及行业规范学习，帮助学生建立理论联系实际的能力，培养职业素养与团队协作精神，为其后续专业课程学习及未来职业发展奠定实践基础。"  },
  { id: 88, name: "绘画实习", enName: "Painting Internship", code: "231104052", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 3, description: "《绘画实习》是智慧建筑与建造专业的重要实践教学环节，旨在通过写生训练帮助学生掌握透视规律、色调处理及空间表现等绘画原理与技法。课程注重培养学生的艺术感知力与造型表现能力，为其后续建筑设计课程奠定美学基础，同时强化职业素养与团队协作精神的培育。"  },
  { id: 89, name: "建筑测绘实习", enName: "Surveying Internship", code: "231104053", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 4, description: "《建筑测绘实习》是智慧建筑与建造专业的重要实践课程，旨在通过数字地形图测绘等实操训练，巩固测量理论知识并提升现代测绘仪器应用能力。课程通过水准仪、全站仪、三维扫描仪等设备的实践操作，培养学生严谨的科学态度与团队协作精神，为其从事工程测量、施工管理等工作奠定扎实基础。"  },
  { id: 90, name: "智慧建筑构造实习", enName: "Smart Construction Internship", code: "231104054", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 5, description: "《智慧建筑构造实习》是本科教学的重要实践环节，通过实地观察建筑构造与材质应用，深化学生对建筑构造理论的理解。课程要求学生完成构造节点测绘与实习报告，培养理论联系实际的能力，为其从事建筑工程专业技术工作奠定基础，同时注重工程伦理意识与团队协作精神的培育。"  },
  { id: 91, name: "BIM 建筑工程建模", enName: "BIM Modeling", code: "231104055", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 6, description: "《BIM建筑工程建模》是智慧建筑与建造专业的重要专业实践课程，旨在培养学生综合利用BIM技术完成工程项目开发的能力。课程通过BIM标准应用、Revit建模及施工模拟等实践环节，使学生掌握建筑信息模型在全生命周期中的应用，具备工程设计、施工控制与运营维护的实践能力，同时注重培育工匠精神与创新意识。"  },
  { id: 92, name: "智慧建筑设计 1", enName: "Smart Building Design 1", code: "231104056", category: "专业实践", subcategory: "设计", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 3, description: "《智慧建筑设计1》是智慧建筑与建造专业的重要专业实践课程，旨在培养学生综合运用CAD制图技术与专业知识完成实际项目设计的能力。课程通过天正建筑等专业软件的操作训练，使学生掌握标准化图纸设计与创新解决方案的制定方法，为其开展毕业设计及未来从事智慧建造工作奠定基础，同时注重培育科技报国意识与团队协作精神。"  },
  { id: 93, name: "智慧建筑设计 2", enName: "Smart Building Design 2", code: "231104057", category: "专业实践", subcategory: "设计", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 4, description: "《智慧建筑设计2》是智慧建筑与建造专业的课内实践课程，旨在培养学生综合运用智慧建筑设计原理与方法完成办公楼等实际项目设计的能力。课程通过巩固施工图绘制、空间规划及创新方案设计等训练，强化学生专业实践与团队协作能力，为其毕业设计及未来职业发展奠定基础，同时注重培育职业道德与社会责任感。"  },
  { id: 94, name: "智慧建筑与建造综合设计 1", enName: "Integrated Design 1", code: "231104058", category: "专业实践", subcategory: "设计", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 5, description: "《智慧建筑与建造综合设计1》是面向建筑工程专业本科生的课内实践课程，旨在培养学生综合运用智慧建筑理论与技术完成实际项目开发的能力。课程通过系统设计、技术集成及团队协作等实践训练，使学生掌握智慧建筑系统的设计与集成方法，提升解决复杂工程问题的实践能力，为其开展毕业设计及未来职业发展奠定基础，同时注重培育创新意识与团队协作精神。"  },
  { id: 95, name: "智慧建筑与建造综合设计 2", enName: "Integrated Design 2", code: "231104059", category: "专业实践", subcategory: "设计", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 6, description: "《智慧建筑与建造综合设计2》是面向建筑工程专业本科生的课内实践课程，重点培养学生掌握公共建筑设计全流程方法与综合解决问题的能力。课程通过项目实践、案例分析及团队协作，使学生能够独立完成从前期调研到方案表达的设计流程，并在设计中综合考虑环境、技术与社会因素，为后续毕业设计及职业发展奠定扎实基础，同时强化创新意识与社会责任感。"  },
  { id: 96, name: "智慧建筑与建造综合设计 3", enName: "Integrated Design 3", code: "231104060", category: "专业实践", subcategory: "设计", nature: "必修", credit: 3, totalHours: "3周", assessment: "考查", semester: 7, description: "《智慧建筑与建造综合设计3》是智慧建筑与建造专业的课内实践课程，重点培养学生掌握博览类建筑设计的专业方法与综合解决问题的能力。课程通过博物馆等专项设计实践，使学生能够独立完成从方案构思到施工图表达的全流程设计，并在设计中注重新技术应用与实验验证，为毕业设计及未来职业发展奠定扎实基础，同时强化工程伦理意识与创新精神。"  },
  { id: 97, name: "毕业实习", enName: "Graduation Internship", code: "231104061", category: "专业实践", subcategory: "毕业环节", nature: "必修", credit: 4, totalHours: "4周", assessment: "考查", semester: 8, description: "《毕业实习》是智慧建筑与建造专业本科教育的重要实践教学环节，旨在通过企业实践深化学生对专业理论的理解，了解行业前沿技术与发展趋势。实习通过专题报告、现场参观等方式，培养学生理论联系实际的能力，提升工程专业素养与职业适应能力，为其顺利完成毕业设计和未来职业发展奠定坚实基础，同时注重培育工程伦理意识与团队协作精神。"  },
  { id: 98, name: "毕业设计", enName: "Graduation Project", code: "231104062", category: "专业实践", subcategory: "毕业环节", nature: "必修", credit: 14, totalHours: "14周", assessment: "考查", semester: 8, description: "《毕业设计（论文）》是智慧建筑与建造专业本科教学最终的综合性实践环节，旨在通过课题研究、方案设计及论文撰写等过程，全面培养学生分析解决复杂工程问题的能力。课程注重理论联系实际，锻炼学生独立工作与创新思维，为其成为行业技术骨干或学术后备人才奠定基础，同时强化社会责任意识与终身学习能力。"  },

  // --- 七、第二课堂 ---
  { id: 99, name: "军事技能", enName: "Military Training", code: "233205001", category: "第二课堂", subcategory: "实践", nature: "必修", credit: 2, totalHours: "3周", assessment: "考查", semester: 1, description: "《军事技能》是本科教育的重要实践教学环节，通过分队队列、战术训练、战场救护等军事课目实践，培养学生的国防安全意识与基本军事素养。课程注重强化爱国主义精神和团队协作能力，帮助学生掌握必备的应急应变与组织管理技能，为其综合素质提升和未来职业发展奠定坚实基础。"  },
  { id: 100, name: "创新创业实践", enName: "Innovation Practice", code: "233311001", category: "第二课堂", subcategory: "实践", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 7 },
  { id: 101, name: "劳动实践", enName: "Laboring Practice", code: "232511001", category: "第二课堂", subcategory: "实践", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 2, description: "《劳动实践》是全日制本科各专业第二课堂的重要培养环节，通过日常生活劳动、公益服务与特色劳动等实践活动，帮助学生掌握必要劳动技能，树立正确劳动观念。课程注重发挥劳动育人功能，培养学生吃苦耐劳精神与团队协作能力，促进学生德智体美劳全面发展。"  },
];

// --- UI Components ---

const Modal = ({ course, onClose }: { course: Course; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
        <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
          <div>
            <div className="text-xs font-mono text-blue-300 mb-1">{course.code}</div>
            <h3 className="text-2xl font-bold">{course.name}</h3>
            <p className="text-slate-400 text-sm mt-1 italic">{course.enName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">性质</div>
              <div className={`font-semibold ${course.nature === '必修' ? 'text-blue-600' : 'text-amber-600'}`}>
                {course.nature}
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">学分</div>
              <div className="font-semibold text-slate-900">{course.credit}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">学时</div>
              <div className="font-semibold text-slate-900">{course.totalHours.split(' ')[0]}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg">
              <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">考核</div>
              <div className="font-semibold text-slate-900">{course.assessment}</div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
             <h4 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
                <Info size={18} className="text-blue-500" /> 
                课程详情
             </h4>
             {course.description ? (
               <p className="text-slate-600 leading-relaxed">{course.description}</p>
             ) : (
               <p className="text-slate-400 italic">暂无详细描述。</p>
             )}
             
             <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Layers size={16} className="text-slate-400" />
                  <span>类别: {course.category} - {course.subcategory}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock size={16} className="text-slate-400" />
                  <span>学时分配: {course.totalHours}</span>
                </div>
             </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-200">
          <button onClick={onClose} className="px-6 py-2 bg-white border border-slate-300 rounded-full text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium">
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

const CourseCard = ({ course, onClick }: { course: Course; onClick: (c: Course) => void }) => {
  const isCompulsory = course.nature === '必修';
  
  return (
    <div 
      onClick={() => onClick(course)}
      className={`
        group relative bg-white rounded-xl border border-slate-200 p-4 cursor-pointer 
        hover:shadow-lg hover:border-blue-300 transition-all duration-200
        flex flex-col h-full
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`
          px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
          ${isCompulsory ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}
        `}>
          {course.nature}
        </span>
        <span className="text-[10px] font-mono text-slate-400">{course.code}</span>
      </div>
      
      <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight group-hover:text-blue-700 transition-colors">
        {course.name}
      </h3>
      <p className="text-xs text-slate-500 line-clamp-1 mb-4">{course.enName}</p>
      
      <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <CreditCard size={14} className="text-slate-400"/>
          <span>{course.credit} 学分</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} className="text-slate-400"/>
          <span>{course.totalHours.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [viewMode, setViewMode] = useState<'semester' | 'category'>('semester');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filter Logic
  const filteredCourses = useMemo(() => {
    return COURSES.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            course.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSemester = selectedSemester === 'all' || course.semester === selectedSemester;
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      return matchesSearch && matchesSemester && matchesCategory;
    });
  }, [searchQuery, selectedSemester, selectedCategory]);

  // Grouping Logic
  const groupedCourses = useMemo(() => {
    if (viewMode === 'semester') {
      const groups: Record<number, Course[]> = {};
      // Initialize 1-8
      for(let i=1; i<=8; i++) groups[i] = [];
      
      filteredCourses.forEach(c => {
        if (!groups[c.semester]) groups[c.semester] = [];
        groups[c.semester].push(c);
      });
      return groups;
    } else {
      const groups: Record<string, Course[]> = {};
      filteredCourses.forEach(c => {
        if (!groups[c.category]) groups[c.category] = [];
        groups[c.category].push(c);
      });
      // Custom order for categories if needed, or just Object.entries
      return groups;
    }
  }, [filteredCourses, viewMode]);

  const categories = useMemo(() => Array.from(new Set(COURSES.map(c => c.category))), []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white pt-10 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-400 font-medium mb-2">
                <Building size={20} />
                <span>NCHU：Smart Building & Construction</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                南昌航空大学智慧建筑与建造专业<br className="md:hidden"/>教学计划
              </h1>
              <p className="text-slate-400 mt-2 max-w-xl">
                南昌航空大学智能建筑与建造专业：软科2024、2025专业排名全国第三、江西省第一，学科实力获教育部新工科研究与改革实践项目认证。学科依托学校航空背景，独创“空天地一体化”课程体系。
              </p>
            </div>
            
            <div className="flex gap-4 text-sm">
              <div className="bg-slate-800/50 p-3 rounded-lg backdrop-blur-sm border border-slate-700">
                <div className="text-slate-400 text-xs uppercase">总课程</div>
                <div className="text-2xl font-bold">{COURSES.length}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-lg backdrop-blur-sm border border-slate-700">
                 <div className="text-slate-400 text-xs uppercase">总学分</div>
                 <div className="text-2xl font-bold text-blue-400">
                   {COURSES.reduce((acc, c) => acc + c.credit, 0).toFixed(1)}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="搜索课程名称或代码..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-slate-800"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* View Toggle */}
            <div className="bg-slate-100 p-1 rounded-lg flex items-center">
              <button 
                onClick={() => setViewMode('semester')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'semester' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Calendar size={16} /> 学期
              </button>
              <button 
                onClick={() => setViewMode('category')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${viewMode === 'category' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Layers size={16} /> 类别
              </button>
            </div>

            <div className="h-6 w-px bg-slate-300 mx-1 hidden sm:block"></div>

            {/* Category Filter (Dropdown) */}
            <div className="relative group">
              <select 
                className="appearance-none bg-slate-100 pl-4 pr-10 py-2 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-slate-200 transition-colors"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <option value="all">所有类别</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>

            {/* Semester Filter (Dropdown for mobile, Pills for desktop if space allows, sticking to dropdown for clean compact look on complex dashboards) */}
            <div className="relative group">
               <select
                 className="appearance-none bg-slate-100 pl-4 pr-10 py-2 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-slate-200 transition-colors"
                 value={selectedSemester}
                 onChange={e => setSelectedSemester(e.target.value === 'all' ? 'all' : Number(e.target.value))}
               >
                 <option value="all">所有学期</option>
                 {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>第 {s} 学期</option>)}
               </select>
               <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <main className="flex-1 bg-slate-50 px-6 py-8 -mt-4 z-0 relative">
        <div className="max-w-7xl mx-auto">
          {Object.keys(groupedCourses).length === 0 && (
             <div className="text-center py-20 text-slate-400">
               <Filter size={48} className="mx-auto mb-4 opacity-20" />
               <p>没有找到符合条件的课程</p>
             </div>
          )}

          {viewMode === 'semester' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                 // Only show if semester matches filter
                 if (selectedSemester !== 'all' && selectedSemester !== sem) return null;
                 
                 const courses = (groupedCourses as Record<number, Course[]>)[sem] || [];
                 if (courses.length === 0 && selectedSemester === 'all') return null;

                 return (
                  <div key={sem} className="flex flex-col gap-4 animate-in fade-in duration-500 slide-in-from-bottom-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-slate-200">
                      <div className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">
                        {sem}
                      </div>
                      <h2 className="font-semibold text-slate-700">第 {sem} 学期</h2>
                      <span className="text-xs text-slate-400 ml-auto">{courses.length} 门课</span>
                    </div>
                    <div className="grid gap-4">
                      {courses.map(course => (
                        <CourseCard key={course.id} course={course} onClick={setSelectedCourse} />
                      ))}
                      {courses.length === 0 && (
                        <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                          本学期无课程安排
                        </div>
                      )}
                    </div>
                  </div>
                 );
              })}
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedCourses as Record<string, Course[]>).map(([cat, courses]) => (
                <div key={cat} className="animate-in fade-in duration-500">
                   <div className="flex items-center gap-4 mb-6">
                     <div className="h-8 w-1.5 bg-blue-500 rounded-full"></div>
                     <h2 className="text-2xl font-bold text-slate-800">{cat}</h2>
                     <div className="h-px flex-1 bg-slate-200"></div>
                     <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                       {courses.length} 门课程
                     </span>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                     {courses.map(course => (
                        <CourseCard key={course.id} course={course} onClick={setSelectedCourse} />
                     ))}
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
         <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-slate-800 font-bold text-xl mb-4">
              <Building className="text-blue-500" />
              <span>智慧建筑与建造</span>
            </div>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              面向未来的建筑工程人才培养方案，涵盖数字化设计、智能施工、BIM技术与全生命周期管理。
            </p>
            <div className="mt-8 text-xs text-slate-400">
              © 2024 教学计划展示系统
            </div>
         </div>
      </footer>

      {/* Modal */}
      {selectedCourse && <Modal course={selectedCourse} onClose={() => setSelectedCourse(null)} />}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
    
