const BASE_URL = 'https://verticalapi.com';

export const departmentsAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/departments`);
    if (!res.ok) throw new Error('فشل في جلب الأقسام');
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(`${BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('فشل في إضافة القسم');
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('فشل في تعديل القسم');
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/departments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('فشل في حذف القسم');
    return res.json();
  },
};

export const employeesAPI = {
  getManagers: async () => {
    const res = await fetch(`${BASE_URL}/employees?role=manager`);
    if (!res.ok) throw new Error('فشل في جلب المدراء');
    return res.json();
  },
};

export const mockDepartments = [
  { id: 1, nameAr: 'قسم الموارد البشرية', nameEn: 'Human Resources', manager: 'أحمد محمد', employeeCount: 12, achievement: 75 },
  { id: 2, nameAr: 'قسم المالية', nameEn: 'Finance', manager: 'سارة أحمد', employeeCount: 8, achievement: 50 },
  { id: 3, nameAr: 'قسم تقنية المعلومات', nameEn: 'Information Technology', manager: 'محمد علي', employeeCount: 20, achievement: 90 },
  { id: 4, nameAr: 'قسم التسويق', nameEn: 'Marketing', manager: 'فاطمة خالد', employeeCount: 6, achievement: 30 },
  { id: 5, nameAr: 'قسم المبيعات', nameEn: 'Sales', manager: 'عمر حسن', employeeCount: 15, achievement: 45 },
  { id: 6, nameAr: 'قسم العمليات', nameEn: 'Operations', manager: 'ليلى عبد الله', employeeCount: 18, achievement: 68 },
];


export const employeesFullAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/employees`);
    if (!res.ok) throw new Error('فشل في جلب الموظفين');
    return res.json();
  },
  create: async (data) => {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('فشل في إضافة الموظف');
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('فشل في تعديل الموظف');
    return res.json();
  },
  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/employees/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('فشل في حذف الموظف');
    return res.json();
  },
};

export const mockEmployees = [
  { id: 1,  nameAr: 'أحمد محمد',      nameEn: 'Ahmed Mohammed',   departmentId: 1, jobTitle: 'مدير الموارد البشرية', email: 'ahmed@company.com',   phone: '0501234567', status: 'active' },
  { id: 2,  nameAr: 'سارة أحمد',      nameEn: 'Sara Ahmed',       departmentId: 2, jobTitle: 'محاسبة',               email: 'sara@company.com',    phone: '0502234567', status: 'active' },
  { id: 3,  nameAr: 'محمد علي',        nameEn: 'Mohammed Ali',     departmentId: 3, jobTitle: 'مطور برمجيات',        email: 'mali@company.com',    phone: '0503234567', status: 'active' },
  { id: 4,  nameAr: 'فاطمة خالد',     nameEn: 'Fatima Khaled',    departmentId: 4, jobTitle: 'مسوّقة رقمية',        email: 'fatima@company.com',  phone: '0504234567', status: 'active' },
  { id: 5,  nameAr: 'عمر حسن',        nameEn: 'Omar Hassan',      departmentId: 5, jobTitle: 'مندوب مبيعات',        email: 'omar@company.com',    phone: '0505234567', status: 'active' },
  { id: 6,  nameAr: 'ليلى عبد الله',  nameEn: 'Layla Abdullah',   departmentId: 6, jobTitle: 'مديرة العمليات',      email: 'layla@company.com',   phone: '0506234567', status: 'active' },
  { id: 7,  nameAr: 'خالد يوسف',      nameEn: 'Khaled Yousef',    departmentId: 1, jobTitle: 'أخصائي تدريب',        email: 'khaled@company.com',  phone: '0507234567', status: 'active' },
  { id: 8,  nameAr: 'نورة السالم',    nameEn: 'Noura AlSalem',    departmentId: 3, jobTitle: 'مطورة واجهات',        email: 'noura@company.com',   phone: '0508234567', status: 'active' },
  { id: 9,  nameAr: 'يوسف الغامدي',   nameEn: 'Yousef AlGhamdi',  departmentId: 2, jobTitle: 'مدير مالي',           email: 'yousef@company.com',  phone: '0509234567', status: 'inactive' },
  { id: 10, nameAr: 'هند الزهراني',   nameEn: 'Hind AlZahrani',   departmentId: 5, jobTitle: 'مشرفة مبيعات',       email: 'hind@company.com',    phone: '0510234567', status: 'active' },
  { id: 11, nameAr: 'عبد الرحمن نور', nameEn: 'AbdulRahman Nour', departmentId: 4, jobTitle: 'مصمم جرافيك',        email: 'abdulr@company.com',  phone: '0511234567', status: 'active' },
  { id: 12, nameAr: 'منى القحطاني',   nameEn: 'Mona AlQahtani',   departmentId: 6, jobTitle: 'محللة بيانات',        email: 'mona@company.com',    phone: '0512234567', status: 'active' },
];

export const authAPI = {
  login: async (username, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw new Error('فشل تسجيل الدخول');
    return res.json(); // { token, user }
  },
};

export const mockCredentials = { username: 'admin', password: '1234' };
