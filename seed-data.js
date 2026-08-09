// Seed data for Samaro
// Run via: window.seedFirestoreData(true) while logged into the admin.

window.seedFirestoreData = function(clearExisting) {
    var db = window.db;
    var products = [
        { name: 'حشوة توت للكيك', brand: 'Samaro', category: 'حشوات وصوصات', price: 28, image: 'products/fb-03.jpg', description: 'حشوة توت غنية للقوالب والتشيز كيك والكرواسون.', status: 'bestseller', inStock: true, order: 1 },
        { name: 'بودرة لوز للحلويات', brand: 'Samaro', category: 'مواد خام', price: 35, image: 'products/fb-04.jpg', description: 'لوز مطحون ناعم لتحضير الماكرون والكيك والحشوات.', status: '', inStock: true, order: 2 },
        { name: 'كريمة حشوات متنوعة', brand: 'Samaro', category: 'حشوات وصوصات', price: 32, image: 'products/fb-05.jpg', description: 'نكهات متعددة للحشو والتغطية والتزيين.', status: 'special', inStock: true, order: 3 },
        { name: 'جوز هند محمص', brand: 'ViaSweet', category: 'مواد خام', price: 18, image: 'products/fb-06.jpg', description: 'جوز هند محمص لإضافة طعم وقوام مميز للحلويات.', status: '', inStock: true, order: 4 },
        { name: 'حشوة بوينو للشوكولاتة', brand: 'Chocolake', category: 'حشوات وصوصات', price: 48, image: 'products/fb-07.jpg', description: 'حشوة شوكولاتة وبندق كريمية للكيك والكريب.', status: 'bestseller', inStock: true, order: 5 },
        { name: 'شوكولاتة حليب حبيبات', brand: 'Vanoise', category: 'شوكولاتة وبدائل', price: 29, image: 'products/fb-08.jpg', description: 'حبيبات شوكولاتة حليب للذوبان والكوكيز والتغطية.', status: 'bestseller', inStock: true, order: 6 },
        { name: 'شوكولاتة بيضاء حبيبات', brand: 'Vanoise', category: 'شوكولاتة وبدائل', price: 31, image: 'products/fb-09.jpg', description: 'شوكولاتة بيضاء سهلة الذوبان للتزيين والحشوات.', status: '', inStock: true, order: 7 },
        { name: 'سكر بني ناعم', brand: 'ViaSweet', category: 'مواد خام', price: 16, image: 'products/fb-10.jpg', description: 'سكر بني بقوام ناعم للكوكيز والكيك والصوصات.', status: '', inStock: true, order: 8 },
        { name: 'كاكاو بودرة داكن', brand: 'Vanoise', category: 'مواد خام', price: 24, image: 'products/fb-11.jpg', description: 'كاكاو غني للكيك والبراونيز والمشروبات الساخنة.', status: 'special', inStock: true, order: 9 },
        { name: 'كاكاو خام للحلويات', brand: 'Samaro', category: 'مواد خام', price: 22, image: 'products/fb-12.jpg', description: 'بودرة كاكاو متعددة الاستخدامات للمخبوزات.', status: '', inStock: true, order: 10 },
        { name: 'سكر بني خشن', brand: 'ViaSweet', category: 'مواد خام', price: 17, image: 'products/fb-13.jpg', description: 'سكر بني بطعم الكراميل للوصفات المخبوزة.', status: '', inStock: true, order: 11 },
        { name: 'شوكولاتة بيضاء للتغطية', brand: 'Vanoise', category: 'شوكولاتة وبدائل', price: 34, image: 'products/fb-14.jpg', description: 'حبيبات شوكولاتة بيضاء للتغطية والقوالب.', status: 'special', inStock: true, order: 12 },
        { name: 'شوكولاتة داكنة حبيبات', brand: 'Vanoise', category: 'شوكولاتة وبدائل', price: 33, image: 'products/fb-15.jpg', description: 'شوكولاتة داكنة بطعم متوازن للغاناش والحلويات.', status: 'bestseller', inStock: true, order: 13 },
        { name: 'حشوة بوينو اقتصادية', brand: 'Chocolake', category: 'حشوات وصوصات', price: 42, image: 'products/fb-16.jpg', description: 'عبوة عملية للمشاريع المنزلية ومحلات الحلويات.', status: '', inStock: true, order: 14 },
        { name: 'قاعدة دوارة لتزيين الكيك', brand: 'Samaro', category: 'أدوات تزيين', price: 45, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', description: 'قاعدة ثابتة تسهّل تغطية الكيك وتزيينه من جميع الجهات.', status: 'bestseller', inStock: true, order: 15 },
        { name: 'طقم أكياس ورؤوس تزيين', brand: 'Samaro', category: 'أدوات تزيين', price: 25, image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&h=400&fit=crop', description: 'طقم مناسب للكريمة والورود والكتابة على الكيك.', status: '', inStock: true, order: 16 },
        { name: 'قالب كب كيك 12 خانة', brand: 'Samaro', category: 'قوالب ومستلزمات', price: 38, image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop', description: 'قالب متين للكب كيك والمافن بنتائج متساوية.', status: '', inStock: true, order: 17 },
        { name: 'قالب تارت دائري', brand: 'Samaro', category: 'قوالب ومستلزمات', price: 32, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400&h=400&fit=crop', description: 'قالب عملي للتارت والكيش بقاع سهل الفك.', status: '', inStock: true, order: 18 },
        { name: 'خميرة فورية للمخبوزات', brand: 'Samaro', category: 'مواد خام', price: 12, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop', description: 'خميرة فعالة للعجين والمخبوزات المنزلية.', status: '', inStock: true, order: 19 },
        { name: 'زينة كيك ذهبية', brand: 'Samaro', category: 'زينة الكيك', price: 20, image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=400&h=400&fit=crop', description: 'زينة أنيقة للمناسبات وأعياد الميلاد.', status: 'special', inStock: true, order: 20 },
        { name: 'ألوان طعام مركزة', brand: 'Samaro', category: 'زينة الكيك', price: 15, image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=400&fit=crop', description: 'ألوان مركزة للكريمة والفوندان والعجين.', status: '', inStock: true, order: 21 },
        { name: 'شوكولاتة خام للقوالب', brand: 'Vanoise', category: 'شوكولاتة وبدائل', price: 36, image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop', description: 'شوكولاتة مناسبة للقوالب والغاناش والتغطية.', status: 'bestseller', inStock: true, order: 22 },
        { name: 'رشات تزيين ملونة', brand: 'Samaro', category: 'زينة الكيك', price: 14, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=400&fit=crop', description: 'تشكيلة ألوان لإضافة لمسة مرحة للكب كيك والكيك.', status: '', inStock: true, order: 23 },
        { name: 'قطاعات كوكيز متنوعة', brand: 'Samaro', category: 'قوالب ومستلزمات', price: 18, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop', description: 'أشكال متعددة للكوكيز والبسكويت والمناسبات.', status: '', inStock: true, order: 24 }
    ];

    function writeProducts(batch, productsRef) {
        products.forEach(function(product, index) {
            var docRef = productsRef.doc(String(index + 1));
            product.id = index + 1;
            product.sizes = [{ size: 'عبوة', unit: '', price: product.price }];
            batch.set(docRef, product);
        });
    }

    function runSeed() {
        var batch = db.batch();
        var productsRef = db.collection('products');
        var settingsRef = db.collection('settings').doc('config');
        var settings = {
            whatsappNumber: '972569236758',
            heroSubtitle: 'كل ما تحتاجينه لصناعة كيك وحلويات مميزة',
            aboutText: 'سمارو وجهتكم في نابلس لجميع مستلزمات الكيك والحلويات.\nنوفر مواد خام، شوكولاتة، حشوات، زينة وأدوات مختارة بجودة عالية لتنجح كل وصفة.',
            instagramLink: 'https://www.facebook.com/profile.php?id=100063760787633',
            tiktokLink: ''
        };

        if (clearExisting) {
            return productsRef.get().then(function(snapshot) {
                var deleteBatch = db.batch();
                snapshot.forEach(function(doc) { deleteBatch.delete(doc.ref); });
                return deleteBatch.commit();
            }).then(function() {
                var addBatch = db.batch();
                writeProducts(addBatch, productsRef);
                addBatch.set(settingsRef, settings);
                return addBatch.commit();
            }).then(function() {
                console.log('Seeded ' + products.length + ' products successfully!');
            });
        }

        writeProducts(batch, productsRef);
        batch.set(settingsRef, settings);
        return batch.commit().then(function() {
            console.log('Seeded ' + products.length + ' products successfully!');
        });
    }

    return runSeed();
};
