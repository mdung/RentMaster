package com.rentmaster.localization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class LocalizationDataInitializer implements CommandLineRunner {

    @Autowired
    private LanguageRepository languageRepository;
    
    @Autowired
    private LocaleConfigRepository localeConfigRepository;
    
    @Autowired
    private CurrencyLocalizationRepository currencyLocalizationRepository;
    
    @Autowired
    private DateTimeFormatRepository dateTimeFormatRepository;
    
    @Autowired
    private RegionalComplianceRepository regionalComplianceRepository;
    
    @Autowired
    private TranslationRepository translationRepository;
    
    @Autowired
    private LocalizedTemplateRepository localizedTemplateRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeLanguages();
        initializeLocaleConfigs();
        initializeCurrencies();
        initializeDateTimeFormats();
        initializeRegionalCompliance();
        initializeTranslations();
        initializeLocalizedTemplates();
    }

    private void initializeLanguages() {
        if (languageRepository.count() == 0) {
            // English
            Language english = new Language("en", "English", "English");
            english.setCountryCode("US");
            english.setDirection("LTR");
            english.setActive(true);
            english.setDefault(true);
            english.setSortOrder(1);
            english.setFlagIcon("flag-us");
            english.setCompletionPercentage(100.0);
            languageRepository.save(english);

            // Vietnamese
            Language vietnamese = new Language("vi", "Vietnamese", "Tiếng Việt");
            vietnamese.setCountryCode("VN");
            vietnamese.setDirection("LTR");
            vietnamese.setActive(true);
            vietnamese.setDefault(false);
            vietnamese.setSortOrder(2);
            vietnamese.setFlagIcon("flag-vn");
            vietnamese.setCompletionPercentage(95.0);
            languageRepository.save(vietnamese);
        }
    }

    private void initializeLocaleConfigs() {
        if (localeConfigRepository.count() == 0) {
            // US English
            LocaleConfig usEnglish = new LocaleConfig("en-US", "English (United States)", "en", "US");
            usEnglish.setCurrencyCode("USD");
            usEnglish.setTimeZone("America/New_York");
            usEnglish.setDateFormat("MM/dd/yyyy");
            usEnglish.setTimeFormat("h:mm a");
            usEnglish.setNumberFormat("#,##0.00");
            usEnglish.setDecimalSeparator(".");
            usEnglish.setThousandsSeparator(",");
            usEnglish.setFirstDayOfWeek(7); // Sunday
            usEnglish.setWeekendDays("1,7"); // Sunday, Saturday
            usEnglish.setMeasurementSystem("IMPERIAL");
            usEnglish.setPaperSize("LETTER");
            usEnglish.setActive(true);
            usEnglish.setDefault(true);
            localeConfigRepository.save(usEnglish);

            // Vietnamese
            LocaleConfig vietnamese = new LocaleConfig("vi-VN", "Tiếng Việt (Việt Nam)", "vi", "VN");
            vietnamese.setCurrencyCode("VND");
            vietnamese.setTimeZone("Asia/Ho_Chi_Minh");
            vietnamese.setDateFormat("dd/MM/yyyy");
            vietnamese.setTimeFormat("HH:mm");
            vietnamese.setNumberFormat("#,##0");
            vietnamese.setDecimalSeparator(",");
            vietnamese.setThousandsSeparator(".");
            vietnamese.setFirstDayOfWeek(1); // Monday
            vietnamese.setWeekendDays("6,7"); // Saturday, Sunday
            vietnamese.setMeasurementSystem("METRIC");
            vietnamese.setPaperSize("A4");
            vietnamese.setActive(true);
            vietnamese.setDefault(false);
            localeConfigRepository.save(vietnamese);
        }
    }

    private void initializeCurrencies() {
        if (currencyLocalizationRepository.count() == 0) {
            // USD
            CurrencyLocalization usd = new CurrencyLocalization("USD", "US Dollar", "$");
            usd.setSymbolPosition("BEFORE");
            usd.setDecimalPlaces(2);
            usd.setDecimalSeparator(".");
            usd.setThousandsSeparator(",");
            usd.setSpaceBetweenSymbol(false);
            usd.setNegativeFormat("MINUS_SIGN");
            usd.setExchangeRate(1.0);
            usd.setBaseCurrency(true);
            usd.setCountryCodes("US");
            usd.setFormatTemplate("{symbol}{amount}");
            currencyLocalizationRepository.save(usd);

            // VND
            CurrencyLocalization vnd = new CurrencyLocalization("VND", "Vietnamese Dong", "₫");
            vnd.setSymbolPosition("AFTER");
            vnd.setDecimalPlaces(0);
            vnd.setDecimalSeparator(",");
            vnd.setThousandsSeparator(".");
            vnd.setSpaceBetweenSymbol(true);
            vnd.setNegativeFormat("MINUS_SIGN");
            vnd.setExchangeRate(24000.0); // Approximate rate
            vnd.setBaseCurrency(false);
            vnd.setCountryCodes("VN");
            vnd.setFormatTemplate("{amount} {symbol}");
            currencyLocalizationRepository.save(vnd);
        }
    }

    private void initializeDateTimeFormats() {
        if (dateTimeFormatRepository.count() == 0) {
            // US Format
            DateTimeFormat usFormat = new DateTimeFormat("US Format", "en-US", "MM/dd/yyyy", "h:mm a");
            usFormat.setShortDatePattern("M/d/yy");
            usFormat.setLongDatePattern("EEEE, MMMM d, yyyy");
            usFormat.setShortTimePattern("h:mm a");
            usFormat.setLongTimePattern("h:mm:ss a z");
            usFormat.setMonthNames("[\"January\",\"February\",\"March\",\"April\",\"May\",\"June\",\"July\",\"August\",\"September\",\"October\",\"November\",\"December\"]");
            usFormat.setShortMonthNames("[\"Jan\",\"Feb\",\"Mar\",\"Apr\",\"May\",\"Jun\",\"Jul\",\"Aug\",\"Sep\",\"Oct\",\"Nov\",\"Dec\"]");
            usFormat.setDayNames("[\"Sunday\",\"Monday\",\"Tuesday\",\"Wednesday\",\"Thursday\",\"Friday\",\"Saturday\"]");
            usFormat.setShortDayNames("[\"Sun\",\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\",\"Sat\"]");
            usFormat.setAmPmDesignators("AM,PM");
            usFormat.setFirstDayOfWeek(7);
            usFormat.setDefault(true);
            dateTimeFormatRepository.save(usFormat);

            // Vietnamese Format
            DateTimeFormat vnFormat = new DateTimeFormat("Vietnamese Format", "vi-VN", "dd/MM/yyyy", "HH:mm");
            vnFormat.setShortDatePattern("d/M/yy");
            vnFormat.setLongDatePattern("EEEE, 'ngày' d 'tháng' M 'năm' yyyy");
            vnFormat.setShortTimePattern("HH:mm");
            vnFormat.setLongTimePattern("HH:mm:ss z");
            vnFormat.setMonthNames("[\"Tháng 1\",\"Tháng 2\",\"Tháng 3\",\"Tháng 4\",\"Tháng 5\",\"Tháng 6\",\"Tháng 7\",\"Tháng 8\",\"Tháng 9\",\"Tháng 10\",\"Tháng 11\",\"Tháng 12\"]");
            vnFormat.setShortMonthNames("[\"T1\",\"T2\",\"T3\",\"T4\",\"T5\",\"T6\",\"T7\",\"T8\",\"T9\",\"T10\",\"T11\",\"T12\"]");
            vnFormat.setDayNames("[\"Chủ nhật\",\"Thứ hai\",\"Thứ ba\",\"Thứ tư\",\"Thứ năm\",\"Thứ sáu\",\"Thứ bảy\"]");
            vnFormat.setShortDayNames("[\"CN\",\"T2\",\"T3\",\"T4\",\"T5\",\"T6\",\"T7\"]");
            vnFormat.setAmPmDesignators("SA,CH");
            vnFormat.setFirstDayOfWeek(1);
            vnFormat.setDefault(false);
            dateTimeFormatRepository.save(vnFormat);
        }
    }

    private void initializeRegionalCompliance() {
        if (regionalComplianceRepository.count() == 0) {
            // United States
            RegionalCompliance us = new RegionalCompliance("US", "United States");
            us.setTaxIdFormat("^\\d{3}-\\d{2}-\\d{4}$"); // SSN format
            us.setTaxIdLabel("Social Security Number");
            us.setPhoneFormat("^\\+?1?[2-9]\\d{2}[2-9]\\d{2}\\d{4}$");
            us.setPostalCodeFormat("^\\d{5}(-\\d{4})?$");
            us.setPostalCodeLabel("ZIP Code");
            us.setAddressFormat("{street}\n{city}, {state} {postalCode}\n{country}");
            us.setCurrencyCode("USD");
            us.setLanguageCodes("en");
            us.setBusinessHours("9:00 AM - 5:00 PM");
            us.setLegalRequirements("[\"Fair Housing Act compliance\",\"Security deposit regulations\",\"Eviction notice requirements\"]");
            us.setDataProtectionRules("[\"CCPA compliance for California residents\",\"GDPR compliance for EU residents\"]");
            us.setContractRequirements("[\"Written lease agreement required\",\"Security deposit disclosure\",\"Lead paint disclosure for pre-1978 properties\"]");
            us.setTenantRights("[\"Right to habitable housing\",\"Right to privacy\",\"Right to non-discrimination\"]");
            us.setLandlordObligations("[\"Maintain habitability\",\"Provide proper notice for entry\",\"Return security deposit within specified time\"]");
            us.setEvictionRules("[\"30-day notice for month-to-month tenancy\",\"3-day notice for non-payment\",\"Court proceedings required\"]");
            us.setDepositRegulations("[\"Maximum 2 months rent in most states\",\"Must be held in separate account\",\"Interest may be required\"]");
            us.setNoticePeriods("{\"entry\":\"24-48 hours\",\"rent_increase\":\"30 days\",\"termination\":\"30 days\"}");
            us.setTaxRates("{\"property_tax\":\"1.2%\",\"rental_income_tax\":\"varies\"}");
            regionalComplianceRepository.save(us);

            // Vietnam
            RegionalCompliance vn = new RegionalCompliance("VN", "Vietnam");
            vn.setTaxIdFormat("^\\d{10,13}$"); // Vietnamese tax ID format
            vn.setTaxIdLabel("Mã số thuế");
            vn.setPhoneFormat("^(\\+84|0)[1-9]\\d{8,9}$");
            vn.setPostalCodeFormat("^\\d{6}$");
            vn.setPostalCodeLabel("Mã bưu điện");
            vn.setAddressFormat("{street}\n{ward}, {district}\n{city} {postalCode}\n{country}");
            vn.setCurrencyCode("VND");
            vn.setLanguageCodes("vi");
            vn.setBusinessHours("8:00 - 17:00");
            vn.setLegalRequirements("[\"Luật Nhà ở 2014\",\"Nghị định về kinh doanh bất động sản\",\"Quy định về hợp đồng thuê nhà\"]");
            vn.setDataProtectionRules("[\"Luật An toàn thông tin mạng\",\"Nghị định về bảo vệ dữ liệu cá nhân\"]");
            vn.setContractRequirements("[\"Hợp đồng thuê nhà bằng văn bản\",\"Đăng ký tạm trú\",\"Nộp thuế thu nhập từ cho thuê nhà\"]");
            vn.setTenantRights("[\"Quyền sử dụng nhà theo hợp đồng\",\"Quyền được bảo vệ quyền lợi hợp pháp\",\"Quyền khiếu nại, tố cáo\"]");
            vn.setLandlordObligations("[\"Giao nhà đúng thời hạn\",\"Bảo đảm nhà ở an toàn\",\"Không tăng giá thuê tùy tiện\"]");
            vn.setEvictionRules("[\"Thông báo trước 30 ngày\",\"Có lý do chính đáng\",\"Tuân thủ quy định pháp luật\"]");
            vn.setDepositRegulations("[\"Tối đa 2 tháng tiền thuê\",\"Hoàn trả trong 30 ngày\",\"Có biên bản bàn giao\"]");
            vn.setNoticePeriods("{\"entry\":\"24 giờ\",\"rent_increase\":\"30 ngày\",\"termination\":\"30 ngày\"}");
            vn.setTaxRates("{\"property_tax\":\"0.03-0.15%\",\"rental_income_tax\":\"5-10%\"}");
            regionalComplianceRepository.save(vn);
        }
    }

    private void initializeTranslations() {
        if (translationRepository.count() == 0) {
            // Common translations
            createTranslation("en", "common", "save", "Save", "Button text for saving data");
            createTranslation("vi", "common", "save", "Lưu", "Văn bản nút để lưu dữ liệu");
            
            createTranslation("en", "common", "cancel", "Cancel", "Button text for canceling action");
            createTranslation("vi", "common", "cancel", "Hủy", "Văn bản nút để hủy hành động");
            
            createTranslation("en", "common", "delete", "Delete", "Button text for deleting item");
            createTranslation("vi", "common", "delete", "Xóa", "Văn bản nút để xóa mục");
            
            createTranslation("en", "common", "edit", "Edit", "Button text for editing item");
            createTranslation("vi", "common", "edit", "Sửa", "Văn bản nút để sửa mục");
            
            createTranslation("en", "common", "add", "Add", "Button text for adding new item");
            createTranslation("vi", "common", "add", "Thêm", "Văn bản nút để thêm mục mới");
            
            createTranslation("en", "common", "search", "Search", "Placeholder text for search input");
            createTranslation("vi", "common", "search", "Tìm kiếm", "Văn bản placeholder cho ô tìm kiếm");
            
            // Navigation
            createTranslation("en", "navigation", "dashboard", "Dashboard", "Main dashboard page");
            createTranslation("vi", "navigation", "dashboard", "Bảng điều khiển", "Trang bảng điều khiển chính");
            
            createTranslation("en", "navigation", "properties", "Properties", "Properties management page");
            createTranslation("vi", "navigation", "properties", "Bất động sản", "Trang quản lý bất động sản");
            
            createTranslation("en", "navigation", "tenants", "Tenants", "Tenants management page");
            createTranslation("vi", "navigation", "tenants", "Người thuê", "Trang quản lý người thuê");
            
            createTranslation("en", "navigation", "contracts", "Contracts", "Contracts management page");
            createTranslation("vi", "navigation", "contracts", "Hợp đồng", "Trang quản lý hợp đồng");
            
            createTranslation("en", "navigation", "invoices", "Invoices", "Invoices management page");
            createTranslation("vi", "navigation", "invoices", "Hóa đơn", "Trang quản lý hóa đơn");
            
            createTranslation("en", "navigation", "payments", "Payments", "Payments management page");
            createTranslation("vi", "navigation", "payments", "Thanh toán", "Trang quản lý thanh toán");
            
            createTranslation("en", "navigation", "settings", "Settings", "Application settings");
            createTranslation("vi", "navigation", "settings", "Cài đặt", "Cài đặt ứng dụng");
            
            createTranslation("en", "navigation", "profile", "Profile", "User profile page");
            createTranslation("vi", "navigation", "profile", "Hồ sơ", "Trang hồ sơ người dùng");
            
            createTranslation("en", "navigation", "logout", "Logout", "Logout from application");
            createTranslation("vi", "navigation", "logout", "Đăng xuất", "Đăng xuất khỏi ứng dụng");
            
            // Dashboard
            createTranslation("en", "dashboard", "welcome", "Welcome to RentMaster", "Welcome message on dashboard");
            createTranslation("vi", "dashboard", "welcome", "Chào mừng đến với RentMaster", "Thông điệp chào mừng trên bảng điều khiển");
            
            createTranslation("en", "dashboard", "total_properties", "Total Properties", "Label for total properties count");
            createTranslation("vi", "dashboard", "total_properties", "Tổng số bất động sản", "Nhãn cho tổng số bất động sản");
            
            createTranslation("en", "dashboard", "total_tenants", "Total Tenants", "Label for total tenants count");
            createTranslation("vi", "dashboard", "total_tenants", "Tổng số người thuê", "Nhãn cho tổng số người thuê");
            
            createTranslation("en", "dashboard", "monthly_revenue", "Monthly Revenue", "Label for monthly revenue");
            createTranslation("vi", "dashboard", "monthly_revenue", "Doanh thu hàng tháng", "Nhãn cho doanh thu hàng tháng");
            
            createTranslation("en", "dashboard", "occupancy_rate", "Occupancy Rate", "Label for occupancy rate");
            createTranslation("vi", "dashboard", "occupancy_rate", "Tỷ lệ lấp đầy", "Nhãn cho tỷ lệ lấp đầy");
            
            // Properties
            createTranslation("en", "properties", "property_name", "Property Name", "Label for property name field");
            createTranslation("vi", "properties", "property_name", "Tên bất động sản", "Nhãn cho trường tên bất động sản");
            
            createTranslation("en", "properties", "address", "Address", "Label for address field");
            createTranslation("vi", "properties", "address", "Địa chỉ", "Nhãn cho trường địa chỉ");
            
            createTranslation("en", "properties", "description", "Description", "Label for description field");
            createTranslation("vi", "properties", "description", "Mô tả", "Nhãn cho trường mô tả");
            
            createTranslation("en", "properties", "add_property", "Add Property", "Button text for adding new property");
            createTranslation("vi", "properties", "add_property", "Thêm bất động sản", "Văn bản nút để thêm bất động sản mới");
            
            // Tenants
            createTranslation("en", "tenants", "full_name", "Full Name", "Label for tenant full name");
            createTranslation("vi", "tenants", "full_name", "Họ và tên", "Nhãn cho họ tên đầy đủ của người thuê");
            
            createTranslation("en", "tenants", "phone", "Phone", "Label for phone number");
            createTranslation("vi", "tenants", "phone", "Số điện thoại", "Nhãn cho số điện thoại");
            
            createTranslation("en", "tenants", "email", "Email", "Label for email address");
            createTranslation("vi", "tenants", "email", "Email", "Nhãn cho địa chỉ email");
            
            createTranslation("en", "tenants", "id_number", "ID Number", "Label for identification number");
            createTranslation("vi", "tenants", "id_number", "Số CMND/CCCD", "Nhãn cho số chứng minh nhân dân/căn cước công dân");
            
            // Contracts
            createTranslation("en", "contracts", "contract_code", "Contract Code", "Label for contract code");
            createTranslation("vi", "contracts", "contract_code", "Mã hợp đồng", "Nhãn cho mã hợp đồng");
            
            createTranslation("en", "contracts", "start_date", "Start Date", "Label for contract start date");
            createTranslation("vi", "contracts", "start_date", "Ngày bắt đầu", "Nhãn cho ngày bắt đầu hợp đồng");
            
            createTranslation("en", "contracts", "end_date", "End Date", "Label for contract end date");
            createTranslation("vi", "contracts", "end_date", "Ngày kết thúc", "Nhãn cho ngày kết thúc hợp đồng");
            
            createTranslation("en", "contracts", "rent_amount", "Rent Amount", "Label for monthly rent amount");
            createTranslation("vi", "contracts", "rent_amount", "Số tiền thuê", "Nhãn cho số tiền thuê hàng tháng");
            
            // Invoices
            createTranslation("en", "invoices", "invoice_number", "Invoice Number", "Label for invoice number");
            createTranslation("vi", "invoices", "invoice_number", "Số hóa đơn", "Nhãn cho số hóa đơn");
            
            createTranslation("en", "invoices", "issue_date", "Issue Date", "Label for invoice issue date");
            createTranslation("vi", "invoices", "issue_date", "Ngày phát hành", "Nhãn cho ngày phát hành hóa đơn");
            
            createTranslation("en", "invoices", "due_date", "Due Date", "Label for invoice due date");
            createTranslation("vi", "invoices", "due_date", "Ngày đến hạn", "Nhãn cho ngày đến hạn hóa đơn");
            
            createTranslation("en", "invoices", "total_amount", "Total Amount", "Label for total invoice amount");
            createTranslation("vi", "invoices", "total_amount", "Tổng số tiền", "Nhãn cho tổng số tiền hóa đơn");
            
            // Status labels
            createTranslation("en", "status", "active", "Active", "Active status");
            createTranslation("vi", "status", "active", "Hoạt động", "Trạng thái hoạt động");
            
            createTranslation("en", "status", "inactive", "Inactive", "Inactive status");
            createTranslation("vi", "status", "inactive", "Không hoạt động", "Trạng thái không hoạt động");
            
            createTranslation("en", "status", "pending", "Pending", "Pending status");
            createTranslation("vi", "status", "pending", "Đang chờ", "Trạng thái đang chờ");
            
            createTranslation("en", "status", "completed", "Completed", "Completed status");
            createTranslation("vi", "status", "completed", "Hoàn thành", "Trạng thái hoàn thành");
            
            createTranslation("en", "status", "cancelled", "Cancelled", "Cancelled status");
            createTranslation("vi", "status", "cancelled", "Đã hủy", "Trạng thái đã hủy");
            
            // Messages
            createTranslation("en", "messages", "success_save", "Data saved successfully", "Success message for saving data");
            createTranslation("vi", "messages", "success_save", "Dữ liệu đã được lưu thành công", "Thông báo thành công khi lưu dữ liệu");
            
            createTranslation("en", "messages", "success_delete", "Item deleted successfully", "Success message for deleting item");
            createTranslation("vi", "messages", "success_delete", "Mục đã được xóa thành công", "Thông báo thành công khi xóa mục");
            
            createTranslation("en", "messages", "error_occurred", "An error occurred", "Generic error message");
            createTranslation("vi", "messages", "error_occurred", "Đã xảy ra lỗi", "Thông báo lỗi chung");
            
            createTranslation("en", "messages", "confirm_delete", "Are you sure you want to delete this item?", "Confirmation message for deletion");
            createTranslation("vi", "messages", "confirm_delete", "Bạn có chắc chắn muốn xóa mục này không?", "Thông báo xác nhận xóa");
        }
    }

    private void createTranslation(String languageCode, String category, String key, String value, String description) {
        Translation translation = new Translation(languageCode, category, key, value);
        translation.setDescription(description);
        translation.setApproved(true);
        translationRepository.save(translation);
    }

    private void initializeLocalizedTemplates() {
        if (localizedTemplateRepository.count() == 0) {
            // Invoice templates
            createLocalizedTemplate("en", "EMAIL", "INVOICE", "Invoice Due Notification", 
                "Invoice #{invoiceNumber} is Due", 
                "Dear {tenantName},\n\nYour invoice #{invoiceNumber} for {propertyName} - {roomCode} is due on {dueDate}.\n\nAmount Due: {totalAmount}\n\nPlease make your payment by the due date to avoid late fees.\n\nThank you,\nRentMaster Team",
                "[\"invoiceNumber\", \"tenantName\", \"propertyName\", \"roomCode\", \"dueDate\", \"totalAmount\"]");
            
            createLocalizedTemplate("vi", "EMAIL", "INVOICE", "Thông báo hóa đơn đến hạn", 
                "Hóa đơn #{invoiceNumber} đến hạn thanh toán", 
                "Kính gửi {tenantName},\n\nHóa đơn #{invoiceNumber} cho {propertyName} - {roomCode} sẽ đến hạn vào ngày {dueDate}.\n\nSố tiền cần thanh toán: {totalAmount}\n\nVui lòng thanh toán trước ngày đến hạn để tránh phí trễ hạn.\n\nTrân trọng,\nĐội ngũ RentMaster",
                "[\"invoiceNumber\", \"tenantName\", \"propertyName\", \"roomCode\", \"dueDate\", \"totalAmount\"]");
            
            // Welcome templates
            createLocalizedTemplate("en", "EMAIL", "WELCOME", "Welcome to RentMaster", 
                "Welcome to RentMaster - Your Property Management Solution", 
                "Dear {userName},\n\nWelcome to RentMaster! We're excited to have you on board.\n\nYour account has been successfully created. You can now access all the features of our property management platform.\n\nIf you have any questions, please don't hesitate to contact our support team.\n\nBest regards,\nRentMaster Team",
                "[\"userName\"]");
            
            createLocalizedTemplate("vi", "EMAIL", "WELCOME", "Chào mừng đến với RentMaster", 
                "Chào mừng đến với RentMaster - Giải pháp quản lý bất động sản", 
                "Kính gửi {userName},\n\nChào mừng bạn đến với RentMaster! Chúng tôi rất vui mừng khi có bạn tham gia.\n\nTài khoản của bạn đã được tạo thành công. Bây giờ bạn có thể truy cập tất cả các tính năng của nền tảng quản lý bất động sản của chúng tôi.\n\nNếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.\n\nTrân trọng,\nĐội ngũ RentMaster",
                "[\"userName\"]");
            
            // Contract templates
            createLocalizedTemplate("en", "DOCUMENT", "CONTRACT", "Rental Agreement Template", 
                "Rental Agreement", 
                "RENTAL AGREEMENT\n\nThis agreement is made between:\nLandlord: {landlordName}\nTenant: {tenantName}\n\nProperty: {propertyAddress}\nRoom: {roomCode}\n\nTerm: From {startDate} to {endDate}\nMonthly Rent: {rentAmount}\nSecurity Deposit: {depositAmount}\n\nTerms and Conditions:\n1. Rent is due on the {dueDay} of each month\n2. Late fees apply after {gracePeriod} days\n3. Tenant is responsible for utilities\n4. No pets allowed without written permission\n\nSignatures:\nLandlord: _________________ Date: _______\nTenant: _________________ Date: _______",
                "[\"landlordName\", \"tenantName\", \"propertyAddress\", \"roomCode\", \"startDate\", \"endDate\", \"rentAmount\", \"depositAmount\", \"dueDay\", \"gracePeriod\"]");
            
            createLocalizedTemplate("vi", "DOCUMENT", "CONTRACT", "Mẫu hợp đồng thuê nhà", 
                "Hợp đồng thuê nhà", 
                "HỢP ĐỒNG THUÊ NHÀ\n\nHợp đồng này được ký kết giữa:\nBên cho thuê: {landlordName}\nBên thuê: {tenantName}\n\nBất động sản: {propertyAddress}\nPhòng: {roomCode}\n\nThời hạn: Từ {startDate} đến {endDate}\nTiền thuê hàng tháng: {rentAmount}\nTiền đặt cọc: {depositAmount}\n\nĐiều khoản và điều kiện:\n1. Tiền thuê phải được thanh toán vào ngày {dueDay} hàng tháng\n2. Phí trễ hạn áp dụng sau {gracePeriod} ngày\n3. Bên thuê chịu trách nhiệm về các khoản tiện ích\n4. Không được nuôi thú cưng mà không có sự cho phép bằng văn bản\n\nChữ ký:\nBên cho thuê: _________________ Ngày: _______\nBên thuê: _________________ Ngày: _______",
                "[\"landlordName\", \"tenantName\", \"propertyAddress\", \"roomCode\", \"startDate\", \"endDate\", \"rentAmount\", \"depositAmount\", \"dueDay\", \"gracePeriod\"]");
        }
    }

    private void createLocalizedTemplate(String languageCode, String templateType, String category, String name, String subject, String content, String variables) {
        LocalizedTemplate template = new LocalizedTemplate(name, languageCode, templateType, content);
        template.setCategory(category);
        template.setSubject(subject);
        template.setVariables(variables);
        template.setDefault(true);
        template.setApprovalStatus("APPROVED");
        localizedTemplateRepository.save(template);
    }
}