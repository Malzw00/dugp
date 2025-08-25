// seed-all.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    // Collages
    await queryInterface.bulkInsert("collages_tb", [
      { collage_name: "كلية الهندسة", created_at: now, updated_at: now },
      { collage_name: "كلية العلوم", created_at: now, updated_at: now },
      { collage_name: "كلية الآداب", created_at: now, updated_at: now },
    ]);

    // Departments
    await queryInterface.bulkInsert("departments_tb", [
      { collage_id: 1, department_name: "هندسة الحاسوب", created_at: now, updated_at: now },
      { collage_id: 1, department_name: "الهندسة المدنية", created_at: now, updated_at: now },
      { collage_id: 2, department_name: "الرياضيات", created_at: now, updated_at: now },
      { collage_id: 2, department_name: "الفيزياء", created_at: now, updated_at: now },
      { collage_id: 3, department_name: "اللغة العربية", created_at: now, updated_at: now },
    ]);

    // Accounts
    await queryInterface.bulkInsert("accounts_tb", [
      { fst_name: "Mohamed", lst_name: "Ali", account_email: "mohamed@example.com", verified_email: 1, hashed_password: "123456", account_role: "admin", profile_image_id: null, created_at: now, updated_at: now },
      { fst_name: "Sara", lst_name: "Yusuf", account_email: "sara@example.com", verified_email: 0, hashed_password: "123456", account_role: "user", profile_image_id: null, created_at: now, updated_at: now },
    ]);

    // Categories
    await queryInterface.bulkInsert("categories_tb", [
      { collage_id: 1, category_name: "ذكاء اصطناعي", created_at: now, updated_at: now },
      { collage_id: 1, category_name: "شبكات", created_at: now, updated_at: now },
      { collage_id: 2, category_name: "رياضيات تطبيقية", created_at: now, updated_at: now },
      { collage_id: 2, category_name: "فيزياء نووية", created_at: now, updated_at: now },
      { collage_id: 3, category_name: "أدب عربي", created_at: now, updated_at: now },
    ]);

    // Keywords
    await queryInterface.bulkInsert("keywords_tb", [
      { keyword: "Machine Learning", created_at: now, updated_at: now },
      { keyword: "Deep Learning", created_at: now, updated_at: now },
      { keyword: "Data Mining", created_at: now, updated_at: now },
      { keyword: "Quantum Physics", created_at: now, updated_at: now },
      { keyword: "Modern Poetry", created_at: now, updated_at: now },
    ]);

    // Supervisors
    await queryInterface.bulkInsert("supervisors_tb", [
      { supervisor_name: "Ali", supervisor_father_name: "Hassan", supervisor_grandfather_name: "Omar", supervisor_family_name: "Salim", supervisor_title: "د.", supervisor_email: "ali@uni.edu", department_id: 1, account_id: 2, profile_image_id: null, created_at: now, updated_at: now },
      { supervisor_name: "Fatima", supervisor_father_name: "Yusuf", supervisor_grandfather_name: "Mahmoud", supervisor_family_name: "Ibrahim", supervisor_title: "أ.د.", supervisor_email: "fatima@uni.edu", department_id: 2, account_id: null, profile_image_id: null, created_at: now, updated_at: now },
    ]);

    // Students
    await queryInterface.bulkInsert("students_tb", [
      { students_name: "Ahmed", students_father_name: "Mohamed", students_grandfather_name: "Hassan", student_family_name: "Ali", student_email: "ahmed@student.edu", department_id: 1, account_id: 3, profile_image_id: null, created_at: now, updated_at: now },
      { students_name: "Omar", students_father_name: "Yahya", students_grandfather_name: "Saleh", student_family_name: "Yasin", student_email: "omar@student.edu", department_id: 2, account_id: null, profile_image_id: null, created_at: now, updated_at: now },
    ]);

    // Projects
    await queryInterface.bulkInsert("projects_tb", [
      { project_title: "نظام إدارة مكتبة", project_description: "مشروع لإدارة الكتب والمستعيرين.", project_year: "2024-01-01", project_semester: "Spring", project_grade: 89.5, department_id: 1, cover_image_id: null, supervisor_id: 1, created_at: now, updated_at: now },
      { project_title: "تحليل بيانات فيزياء", project_description: "مشروع لتحليل البيانات النووية.", project_year: "2024-01-01", project_semester: "Autumn", project_grade: 91.0, department_id: 2, cover_image_id: null, supervisor_id: 2, created_at: now, updated_at: now },
    ]);

    // Project Students
    await queryInterface.bulkInsert("project_students_tb", [
      { project_id: 1, student_id: 1, created_at: now, updated_at: now },
      { project_id: 2, student_id: 2, created_at: now, updated_at: now },
    ]);

    // Project Categories
    await queryInterface.bulkInsert("project_categories_tb", [
      { project_id: 1, category_id: 1, created_at: now, updated_at: now },
      { project_id: 2, category_id: 4, created_at: now, updated_at: now },
    ]);

    // Project Keywords
    await queryInterface.bulkInsert("project_keywords_tb", [
      { keyword_id: 1, project_id: 1, created_at: now, updated_at: now },
      { keyword_id: 4, project_id: 2, created_at: now, updated_at: now },
    ]);

    // Project References
    await queryInterface.bulkInsert("project_references_tb", [
      { ref_title: "Database Design Book", ref_path: "local:/db/book.pdf", project_id: 1, created_at: now, updated_at: now },
      { ref_title: "Nuclear Physics Journal", ref_path: "local:/phy/journal.pdf", project_id: 2, created_at: now, updated_at: now },
    ]);

    // Project Books
    await queryInterface.bulkInsert("project_books_tb", [
      { book_path: "local:/projects/1/book.pdf", project_id: 1, created_at: now, updated_at: now },
      { book_path: "local:/projects/2/book.pdf", project_id: 2, created_at: now, updated_at: now },
    ]);

    // Project Presentations
    await queryInterface.bulkInsert("project_presentations_tb", [
      { presentation_path: "local:/projects/1/pres.pptx", project_id: 1, created_at: now, updated_at: now },
      { presentation_path: "local:/projects/2/pres.pptx", project_id: 2, created_at: now, updated_at: now },
    ]);

    // Project Likes
    await queryInterface.bulkInsert("project_likes_tb", [
      { account_id: 2, project_id: 1, created_at: now, updated_at: now },
      { account_id: 3, project_id: 2, created_at: now, updated_at: now },
    ]);

    // Ratings
    await queryInterface.bulkInsert("ratings_tb", [
      { account_id: 2, project_id: 1, rate: 5, created_at: now, updated_at: now },
      { account_id: 3, project_id: 2, rate: 4, created_at: now, updated_at: now },
    ]);

    // Comments
    await queryInterface.bulkInsert("comments_tb", [
      { comment_content: "مشروع رائع!", project_id: 1, account_id: 2, parent_id: null, created_at: now, updated_at: now },
      { comment_content: "فكرة ممتازة!", project_id: 2, account_id: 3, parent_id: null, created_at: now, updated_at: now },
    ]);

    // Comment Likes
    await queryInterface.bulkInsert("comment_likes_tb", [
      { account_id: 3, comment_id: 1, created_at: now, updated_at: now },
    ]);

    // Comment Reports
    await queryInterface.bulkInsert("comment_reports_tb", [
      { report_reason: "لغة غير مناسبة", is_report_reviewed: 0, is_report_resolved: 0, reporter_id: 2, comment_id: 1, created_at: now, updated_at: now },
    ]);

    // Project Reports
    await queryInterface.bulkInsert("project_reports_tb", [
      { report_reason: "محتوى منسوخ", is_report_reviewed: 0, is_report_resolved: 0, reporter_id: 2, project_id: 1, created_at: now, updated_at: now },
    ]);

    // Account Reports
    await queryInterface.bulkInsert("account_reports_tb", [
      { reporter_id: 1, account_id: 3, report_reason: "إساءة استخدام", is_report_reviewed: 0, is_report_resolved: 0, created_at: now, updated_at: now },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("account_reports_tb", null, {});
    await queryInterface.bulkDelete("project_reports_tb", null, {});
    await queryInterface.bulkDelete("comment_reports_tb", null, {});
    await queryInterface.bulkDelete("comment_likes_tb", null, {});
    await queryInterface.bulkDelete("comments_tb", null, {});
    await queryInterface.bulkDelete("ratings_tb", null, {});
    await queryInterface.bulkDelete("project_likes_tb", null, {});
    await queryInterface.bulkDelete("project_presentations_tb", null, {});
    await queryInterface.bulkDelete("project_books_tb", null, {});
    await queryInterface.bulkDelete("project_references_tb", null, {});
    await queryInterface.bulkDelete("project_keywords_tb", null, {});
    await queryInterface.bulkDelete("project_categories_tb", null, {});
    await queryInterface.bulkDelete("project_students_tb", null, {});
    await queryInterface.bulkDelete("projects_tb", null, {});
    await queryInterface.bulkDelete("students_tb", null, {});
    await queryInterface.bulkDelete("supervisors_tb", null, {});
    await queryInterface.bulkDelete("keywords_tb", null, {});
    await queryInterface.bulkDelete("categories_tb", null, {});
    await queryInterface.bulkDelete("accounts_tb", null, {});
    await queryInterface.bulkDelete("departments_tb", null, {});
    await queryInterface.bulkDelete("collages_tb", null, {});
  },
};
