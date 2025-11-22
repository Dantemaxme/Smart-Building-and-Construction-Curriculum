
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
  { id: 1, name: "四史", enName: "Four History", code: "231304002", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 1, totalHours: "16 (讲授:16)", assessment: "考查", semester: 1, description: "融思想性、政治性、科学性、理论性、实践性为一体。包括党史、新中国史、改革开放史、社会主义发展史。" },
  { id: 2, name: "中国近现代史纲要", enName: "Survey of Modern Chinese History", code: "231304001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考试", semester: 2, description: "认识近现代中国社会发展和革命发展的历史进程及其内在规律。" },
  { id: 3, name: "形势与政策 1", enName: "Position and Policy 1", code: "231306001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 0.5, totalHours: "16", assessment: "考查", semester: 1 },
  { id: 3002, name: "形势与政策 2", enName: "Position and Policy 2", code: "231306002", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 0.5, totalHours: "8", assessment: "考查", semester: 3 },
  { id: 3003, name: "形势与政策 3", enName: "Position and Policy 3", code: "231306003", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 1, totalHours: "8", assessment: "考查", semester: 4 },
  { id: 4, name: "思想道德与法治", enName: "Ideology and Morality and Rule of Law", code: "231303001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考查", semester: 2 },
  { id: 5, name: "习近平新时代中国特色社会主义思想概论", enName: "Intro to Xi Jinping Thought", code: "231302002", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考查", semester: 2 },
  { id: 6, name: "马克思主义基本原理", enName: "Theory of Marxism", code: "231301001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考试", semester: 3 },
  { id: 7, name: "毛泽东思想和中国特色社会主义理论体系概论", enName: "Intro to Mao Zedong Thoughts...", code: "231302001", category: "通识教育", subcategory: "思想政治类", nature: "必修", credit: 3, totalHours: "48 (讲授:40, 实践:8)", assessment: "考试", semester: 2 },
  // 体育类
  { id: 8, name: "体育 1", enName: "Physical Education 1", code: "231011001", category: "通识教育", subcategory: "体育类", nature: "必修", credit: 1, totalHours: "36 (讲授:28, 实践:8)", assessment: "考查", semester: 1 },
  { id: 9, name: "体育 2", enName: "Physical Education 2", code: "231011002", category: "通识教育", subcategory: "体育类", nature: "必修", credit: 1, totalHours: "36 (讲授:28, 实践:8)", assessment: "考查", semester: 2 },
  { id: 10, name: "体育 3", enName: "Physical Education 3", code: "231011003", category: "通识教育", subcategory: "体育类", nature: "必修", credit: 1, totalHours: "36 (讲授:28, 实践:8)", assessment: "考查", semester: 3 },
  { id: 11, name: "体育 4", enName: "Physical Education 4", code: "231011004", category: "通识教育", subcategory: "体育类", nature: "必修", credit: 1, totalHours: "36 (讲授:28, 实践:8)", assessment: "考查", semester: 4 },
  // 外语类
  { id: 12, name: "大学英语 1", enName: "College English 1", code: "230511001", category: "通识教育", subcategory: "外语类", nature: "必修", credit: 2, totalHours: "48", assessment: "考试", semester: 1 },
  { id: 13, name: "大学英语 2", enName: "College English 2", code: "230511002", category: "通识教育", subcategory: "外语类", nature: "必修", credit: 2, totalHours: "48", assessment: "考试", semester: 2 },
  { id: 14, name: "大学英语 3", enName: "College English 3", code: "230511003", category: "通识教育", subcategory: "外语类", nature: "必修", credit: 2, totalHours: "48", assessment: "考试", semester: 3 },
  { id: 15, name: "大学英语提高课程", enName: "Advanced College English", code: "无", category: "通识教育", subcategory: "外语类", nature: "限选", credit: 2, totalHours: "48", assessment: "考查", semester: 3 },
  // 军事 / 智慧 / 创业 / 通识理论
  { id: 16, name: "军事理论与国家安全", enName: "Military Theory & National Security", code: "231305001", category: "通识教育", subcategory: "军事理论类", nature: "必修", credit: 2, totalHours: "36 (讲授:24, 上机:12)", assessment: "考查", semester: 1 },
  { id: 17, name: "计算思维导论", enName: "Computational Thinking", code: "230411003", category: "通识教育", subcategory: "智慧信息类", nature: "必修", credit: 1, totalHours: "16", assessment: "考查", semester: 1 },
  { id: 18, name: "职业生涯规划", enName: "Planning for Occupation", code: "233201001", category: "通识教育", subcategory: "创业就业类", nature: "必修", credit: 1, totalHours: "22 (讲授:16, 上机:6)", assessment: "考查", semester: 1 },
  { id: 19, name: "就业创业指导", enName: "Intro to Employment & Entrepreneurship", code: "233201002", category: "通识教育", subcategory: "创业就业类", nature: "必修", credit: 1, totalHours: "16 (讲授:10, 上机:6)", assessment: "考查", semester: 6 },
  { id: 20, name: "航空航天概论", enName: "Intro to Aeronautics & Astronautics", code: "230612001", category: "通识教育", subcategory: "通识理论类", nature: "必修", credit: 1, totalHours: "16", assessment: "考查", semester: 1 },
  { id: 21, name: "大学生劳动教育", enName: "Labor Education", code: "232501001", category: "通识教育", subcategory: "通识理论类", nature: "必修", credit: 1, totalHours: "16", assessment: "考查", semester: 1 },
  { id: 22, name: "大学生心理健康教育", enName: "Psychological Health Education", code: "233202001", category: "通识教育", subcategory: "通识理论类", nature: "必修", credit: 1, totalHours: "16 (讲授:10, 上机:6)", assessment: "考查", semester: 1 },
  { id: 23, name: "创新创业与论", enName: "Innovation and Entrepreneurship", code: "232601001", category: "通识教育", subcategory: "通识理论类", nature: "必修", credit: 1, totalHours: "16 (讲授:8, 实践:8)", assessment: "考查", semester: 5 },
  // 通识选修
  { id: 24, name: "自然科学与技术进步 (项目管理)", enName: "Project Management", code: "TXZJ00012", category: "通识教育", subcategory: "选修类", nature: "限选", credit: 1, totalHours: "16", assessment: "考查", semester: 6 },
  { id: 25, name: "艺术鉴赏与技艺训练", enName: "Art Appreciation", code: "无", category: "通识教育", subcategory: "选修类", nature: "限选", credit: 2, totalHours: "32", assessment: "考查", semester: 2 },
  { id: 26, name: "语言表达与沟通交流", enName: "Communication", code: "无", category: "通识教育", subcategory: "选修类", nature: "限选", credit: 2, totalHours: "32", assessment: "考查", semester: 5 },
  { id: 27, name: "生态文明与生命健康", enName: "Eco-civilization", code: "TXSS00019", category: "通识教育", subcategory: "选修类", nature: "限选", credit: 1, totalHours: "16", assessment: "考查", semester: 6 },

  // --- 二、数学与自然科学 ---
  { id: 28, name: "高等数学 B1", enName: "Advanced Mathematics B1", code: "230711003", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 5, totalHours: "80", assessment: "考试", semester: 1 },
  { id: 29, name: "高等数学 B2", enName: "Advanced Mathematics B2", code: "230711004", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 5, totalHours: "80", assessment: "考试", semester: 2 },
  { id: 30, name: "线性代数 A", enName: "Linear Algebra", code: "230711005", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 2.5, totalHours: "40", assessment: "考试", semester: 2 },
  { id: 31, name: "大学物理 C", enName: "University Physics C", code: "230811005", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 4, totalHours: "64", assessment: "考试", semester: 3 },
  { id: 32, name: "大学计算机基础训练", enName: "College Computer Basic Training", code: "230411001", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 1, totalHours: "32 (讲授:16, 上机:16)", assessment: "考查", semester: 1 },
  { id: 33, name: "概率论与数理统计", enName: "Probability & Statistics", code: "230711010", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 3, totalHours: "48", assessment: "考试", semester: 3 },
  { id: 34, name: "自然地理学", enName: "Physiography", code: "231104001", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 2 },
  { id: 35, name: "环境生态学概论 A", enName: "Intro to Environmental Ecology A", code: "231104003", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 2 },
  { id: 36, name: "数值计算方法 A", enName: "Numerical Calculation Method A", code: "231104004", category: "数学与自然科学", subcategory: "基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 5 },

  // --- 三、工程基础 ---
  { id: 37, name: "建筑工程制图", enName: "Architectural Engineering Drawings", code: "231104005", category: "工程基础", subcategory: "基础", nature: "必修", credit: 3.5, totalHours: "56", assessment: "考试", semester: 1 },
  { id: 38, name: "工程认识训练 A", enName: "Training for Engineering Cognition A", code: "233101001", category: "工程基础", subcategory: "基础", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 1 },

  // --- 四、专业基础课程 ---
  { id: 39, name: "智慧建筑导论", enName: "Introduction of Smart Buildings", code: "231104006", category: "专业基础", subcategory: "基础", nature: "必修", credit: 1, totalHours: "16", assessment: "考试", semester: 1 },
  { id: 40, name: "素描", enName: "Sketch", code: "231104007", category: "专业基础", subcategory: "美术基础", nature: "必修", credit: 1.5, totalHours: "24", assessment: "考查", semester: 1 },
  { id: 41, name: "色彩", enName: "Color", code: "231104008", category: "专业基础", subcategory: "美术基础", nature: "必修", credit: 1.5, totalHours: "24", assessment: "考查", semester: 1 },
  { id: 42, name: "建筑初步", enName: "Preliminary Building", code: "231104009", category: "专业基础", subcategory: "设计基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 2 },
  { id: 43, name: "建筑美术", enName: "Architectural Art", code: "231104010", category: "专业基础", subcategory: "美术基础", nature: "必修", credit: 2, totalHours: "32", assessment: "考查", semester: 2 },

  // --- 五、专业教育课程 ---
  // 专业核心
  { id: 44, name: "智能测绘", enName: "Smart Mapping", code: "231104011", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 3.5, totalHours: "56 (讲授:40, 实验:16)", assessment: "考试", semester: 3 },
  { id: 45, name: "智慧建筑工程 CAD 制图", enName: "Smart Building Eng CAD", code: "231104012", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2.0, totalHours: "32 (上机:32)", assessment: "考查", semester: 2 },
  { id: 46, name: "BIM 基础与应用", enName: "BIM Fundamentals", code: "231104063", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 1.5, totalHours: "24 (上机:24)", assessment: "考查", semester: 1 },
  { id: 47, name: "建筑力学与建筑结构", enName: "Building Mechanics & Structure", code: "231104013", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 4, totalHours: "64 (讲授:62, 上机:2)", assessment: "考试", semester: 4 },
  { id: 48, name: "Python 程序设计", enName: "Python Programming", code: "231104014", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "40 (讲授:24, 实验:16)", assessment: "考试", semester: 2 },
  { id: 49, name: "智慧建筑设计原理", enName: "Digital Architectural Design", code: "231104015", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 3, totalHours: "48", assessment: "考试", semester: 3 },
  { id: 50, name: "中外建筑史", enName: "Chinese and Foreign Arch History", code: "231104016", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 4, totalHours: "64", assessment: "考试", semester: 4 },
  { id: 51, name: "建筑构造", enName: "Building Construction", code: "231104017", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 2 },
  { id: 52, name: "人工智能与算法设计", enName: "AI and Algorithm Design", code: "231104018", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32 (讲授:16, 实验:16)", assessment: "考试", semester: 5 },
  { id: 53, name: "智能建造与运维", enName: "Intel Construction & O&M", code: "231104019", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 5 },
  { id: 54, name: "公共建筑设计原理", enName: "Principles of public building design", code: "231104020", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 3, totalHours: "48", assessment: "考试", semester: 3 },
  { id: 55, name: "建筑经济", enName: "Construction Economics", code: "231104021", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32", assessment: "考试", semester: 5 },
  { id: 56, name: "数字化施工", enName: "Digital Construction", code: "231104022", category: "专业教育", subcategory: "核心课程", nature: "必修", credit: 2, totalHours: "32 (讲授:24, 实践:8)", assessment: "考试", semester: 5 },
  // 专业拓展 (限选/任选)
  { id: 57, name: "可持续住宅设计原理", enName: "Sustainable Home Design", code: "231104037", category: "专业教育", subcategory: "拓展课程", nature: "限选", credit: 2, totalHours: "32", assessment: "考试", semester: 2 },
  { id: 58, name: "智慧建筑与建造设计原理", enName: "Smart Building & Construction Design", code: "231104024", category: "专业教育", subcategory: "拓展课程", nature: "限选", credit: 2, totalHours: "32", assessment: "考试", semester: 5 },
  { id: 59, name: "智能建造技术与应用", enName: "Intel Construction Tech & App", code: "231104025", category: "专业教育", subcategory: "拓展课程", nature: "限选", credit: 2, totalHours: "32", assessment: "考试", semester: 5 },
  { id: 60, name: "BIM 应用与项目管理", enName: "BIM App & Project Mgmt", code: "231104026", category: "专业教育", subcategory: "拓展课程", nature: "限选", credit: 2, totalHours: "32", assessment: "考试", semester: 5 },
  { id: 61, name: "建筑专业英语", enName: "English for Architecture", code: "231104023", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 6 },
  { id: 62, name: "建筑设备", enName: "Construction Equipment", code: "231104027", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 2 },
  { id: 63, name: "建筑施工组织与技术", enName: "Construction Org & Tech", code: "231104028", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 2 },
  { id: 64, name: "智慧城市", enName: "Smart City", code: "231104029", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 2 },
  { id: 65, name: "建设法规 B", enName: "Construction Regulation B", code: "231104030", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 7 },
  { id: 66, name: "BIM 标准 A", enName: "Introduction of BIM A", code: "231104031", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 7 },
  { id: 67, name: "建筑物理", enName: "Building Physics", code: "231104032", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 1 },
  { id: 68, name: "日光与建筑", enName: "Daylight and Architecture", code: "231104033", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 7 },
  { id: 69, name: "场地规划设计", enName: "Site Planning and Design", code: "231104034", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2.0, totalHours: "32", assessment: "考查", semester: 6 },
  { id: 70, name: "建筑文化生态学", enName: "Architectural Cultural Ecology", code: "231104035", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "24", assessment: "考查", semester: 1 },
  { id: 71, name: "建筑新材料", enName: "New Building Materials", code: "231104036", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 2 },
  { id: 72, name: "绿色建筑与可持续建设管理", enName: "Green Building & Mgmt", code: "231104038", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5 },
  { id: 73, name: "智慧建筑全球化发展概论", enName: "Global Smart Buildings Dev", code: "231104039", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1, totalHours: "16", assessment: "考查", semester: 7 },
  { id: 74, name: "装配式建筑技术与创新实践", enName: "Prefabricated Building Tech", code: "231101065", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "40 (讲授:8, 实践:32)", assessment: "考查", semester: 2 },
  { id: 75, name: "被动智能系统", enName: "Building Intelligence System", code: "231101050", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 1 },
  { id: 76, name: "城市规则原理 A", enName: "Principles of Urban Planning A", code: "231104040", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2.0, totalHours: "32", assessment: "考查", semester: 6 },
  { id: 77, name: "建筑与新媒体", enName: "Architecture and New Media", code: "231104041", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 1 },
  { id: 78, name: "数字化设计前沿", enName: "Frontiers of Digital Design", code: "231104042", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5 },
  { id: 79, name: "大数据管理", enName: "Big Data Management", code: "231104043", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 1 },
  { id: 80, name: "传感与物联网技术", enName: "Sensing and IoT Technology", code: "231104044", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5 },
  { id: 81, name: "智慧建筑与 VR", enName: "Smart Building and VR", code: "231104045", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5 },
  { id: 82, name: "机场净空智慧技术与管理", enName: "Airport Clearance Tech", code: "231104046", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 2 },
  { id: 83, name: "机场建设工程项目管理", enName: "Airport Project Mgmt", code: "231104047", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5 },
  { id: 84, name: "机场道路与交通智能规划", enName: "Airport Traffic Planning", code: "231104048", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5 },
  { id: 85, name: "机场建筑设计原理", enName: "Airport Arch Design Principle", code: "231104049", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 1.5, totalHours: "24", assessment: "考查", semester: 1 },
  { id: 86, name: "建筑环境交互原理", enName: "Built Environment Interaction", code: "231104050", category: "专业教育", subcategory: "拓展课程", nature: "任选", credit: 2, totalHours: "32", assessment: "考查", semester: 5 },

  // --- 六、专业实践课程 ---
  { id: 87, name: "建筑专业认知实习", enName: "Cognitive Internship", code: "231104051", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 1 },
  { id: 88, name: "绘画实习", enName: "Painting Internship", code: "231104052", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 1 },
  { id: 89, name: "建筑测绘实习", enName: "Surveying Internship", code: "231104053", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 1 },
  { id: 90, name: "智慧建筑构造实习", enName: "Smart Construction Internship", code: "231104054", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 1 },
  { id: 91, name: "BIM 建筑工程建模", enName: "BIM Modeling", code: "231104055", category: "专业实践", subcategory: "实习", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 1 },
  { id: 92, name: "智慧建筑设计 1", enName: "Smart Building Design 1", code: "231104056", category: "专业实践", subcategory: "设计", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 2 },
  { id: 93, name: "智慧建筑设计 2", enName: "Smart Building Design 2", code: "231104057", category: "专业实践", subcategory: "设计", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 2 },
  { id: 94, name: "智慧建筑与建造综合设计 1", enName: "Integrated Design 1", code: "231104058", category: "专业实践", subcategory: "设计", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 2 },
  { id: 95, name: "智慧建筑与建造综合设计 2", enName: "Integrated Design 2", code: "231104059", category: "专业实践", subcategory: "设计", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 2 },
  { id: 96, name: "智慧建筑与建造综合设计 3", enName: "Integrated Design 3", code: "231104060", category: "专业实践", subcategory: "设计", nature: "必修", credit: 3, totalHours: "3周", assessment: "考查", semester: 3 },
  { id: 97, name: "毕业实习", enName: "Graduation Internship", code: "231104061", category: "专业实践", subcategory: "毕业环节", nature: "必修", credit: 4, totalHours: "4周", assessment: "考查", semester: 4 },
  { id: 98, name: "毕业设计", enName: "Graduation Project", code: "231104062", category: "专业实践", subcategory: "毕业环节", nature: "必修", credit: 14, totalHours: "14周", assessment: "考查", semester: 8 },

  // --- 七、第二课堂 ---
  { id: 99, name: "军事技能", enName: "Military Training", code: "233205001", category: "第二课堂", subcategory: "实践", nature: "必修", credit: 2, totalHours: "3周", assessment: "考查", semester: 1 },
  { id: 100, name: "创新创业实践", enName: "Innovation Practice", code: "233311001", category: "第二课堂", subcategory: "实践", nature: "必修", credit: 2, totalHours: "2周", assessment: "考查", semester: 2 },
  { id: 101, name: "劳动实践", enName: "Laboring Practice", code: "232511001", category: "第二课堂", subcategory: "实践", nature: "必修", credit: 1, totalHours: "1周", assessment: "考查", semester: 1 },
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
                <span>Smart Building & Construction</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                智慧建筑与建造专业<br className="md:hidden"/>教学计划
              </h1>
              <p className="text-slate-400 mt-2 max-w-xl">
                融合建筑学、土木工程、人工智能与物联网技术的跨学科培养方案。
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
    