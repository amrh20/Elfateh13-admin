# API Integration - Categories Service

## 🚀 تم إزالة جميع البيانات الوهمية

الآن الخدمة تستخدم APIs الحقيقية فقط من الخادم.

## 📡 APIs المستخدمة

### 1. **GET /categories/admin**
- **الوصف**: جلب جميع الأصناف (admin only)
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "description": "string",
      "image": "string",
      "isActive": true,
      "parent": "string",
      "ancestors": ["string"],
      "subcategories": ["string"]
    }
  ]
}
```

### 2. **POST /categories**
- **الوصف**: إنشاء صنف جديد أو صنف فرعي
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: application/json`
- **Request Body**:
```json
{
  "name": "اسم الصنف بالعربية",
  "description": "وصف الصنف بالعربية",
  "image": "رابط الصورة",
  "parent": "parent_id" // فقط للأصناف الفرعية
}
```

### 3. **GET /categories/{id}**
- **الوصف**: جلب صنف واحد بالـ ID
- **Headers**: `Authorization: Bearer {token}`
- **Response**: نفس هيكل البيانات السابق

### 4. **PUT /categories/{id}**
- **الوصف**: تحديث صنف موجود
- **Headers**: `Authorization: Bearer {token}`, `Content-Type: application/json`
- **Request Body**: نفس هيكل POST

### 5. **DELETE /categories/{id}**
- **الوصف**: حذف صنف
- **Headers**: `Authorization: Bearer {token}`
- **Response**: 
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

### 6. **GET /categories**
- **الوصف**: جلب الأصناف العامة (fallback)
- **Headers**: لا يحتاج authentication
- **Response**: نفس هيكل البيانات

## 🔐 Authentication

جميع العمليات (إلا GET /categories) تتطلب:
- `Authorization: Bearer {token}`
- Token يتم الحصول عليه من localStorage

## 🛡️ Error Handling

### **Authentication Errors**:
- إذا لم يكن هناك token → خطأ "Authentication required"
- إذا انتهت صلاحية token → محاولة fallback للـ public endpoint

### **API Errors**:
- إذا فشل admin endpoint → محاولة public endpoint
- إذا فشل public endpoint → إرجاع array فارغ
- جميع الأخطاء يتم logها في console

## 🔄 Fallback Strategy

1. **محاولة admin endpoint أولاً** (مع token)
2. **إذا فشل → محاولة public endpoint**
3. **إذا فشل → إرجاع array فارغ**

## 📊 Data Mapping

### **API Response → Frontend Model**:
```typescript
{
  _id → id,
  name → name,
  nameAr → nameAr (fallback to name),
  description → description,
  descriptionAr → descriptionAr (fallback to description),
  image → image,
  parent → type (sub if exists, main otherwise),
  subcategories → subCategories (mapped array),
  isActive → isActive,
  createdAt → createdAt,
  updatedAt → updatedAt
}
```

## 🚨 Important Notes

### **لا توجد بيانات وهمية**:
- ❌ `mockCategories` array تم حذفه
- ❌ `createMockCategory()` تم حذفه
- ❌ `delay()` operators تم حذفها
- ✅ جميع البيانات تأتي من الخادم

### **Performance**:
- لا توجد delays صناعية
- البيانات يتم تحميلها فوراً من الخادم
- Pagination يعمل مع البيانات الحقيقية

### **Error States**:
- إذا لم يكن هناك internet → array فارغ
- إذا كان الخادم down → array فارغ
- UI يعرض رسائل مناسبة للحالات المختلفة

## 🧪 Testing

### **مع token صحيح**:
- يجب أن تعمل جميع العمليات
- البيانات تأتي من admin endpoint

### **بدون token**:
- فقط GET /categories يعمل
- باقي العمليات تظهر خطأ authentication

### **مع token منتهي الصلاحية**:
- fallback للـ public endpoint
- البيانات محدودة (فقط الأصناف النشطة)

## 🔧 Troubleshooting

### **مشاكل شائعة**:
1. **"Authentication required"** → تأكد من وجود token صحيح
2. **"Failed to create category"** → تأكد من صحة البيانات
3. **Empty categories** → تأكد من اتصال الخادم
4. **CORS errors** → تأكد من إعدادات الخادم

### **Debug**:
- جميع API calls يتم logها في console
- يمكن رؤية request/response details
- Error messages واضحة ومفيدة
