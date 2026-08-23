package com.dmart.utils;

import com.dmart.entity.*;
import com.dmart.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PickupSlotRepository pickupSlotRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            logger.info("Database is empty. Initializing sample data for Mini D-Mart...");

            // 1. Seed Users
            User admin = new User("admin@dmart.com", passwordEncoder.encode("admin123"), "DMart Store Administrator", "+91 9876543210", Role.ROLE_ADMIN);
            admin.setAddress("DMart Headquarters, Sector 15");
            admin.setPincode("400076");
            userRepository.save(admin);

            User staff = new User("staff@dmart.com", passwordEncoder.encode("staff123"), "Priya Sharma (Store Operations)", "+91 9823456789", Role.ROLE_STAFF);
            staff.setAddress("Store #104, Powai Link Road");
            staff.setPincode("400076");
            userRepository.save(staff);

            User customer = new User("customer@dmart.com", passwordEncoder.encode("customer123"), "Rahul Verma", "+91 9765432109", Role.ROLE_CUSTOMER);
            customer.setAddress("Flat 402, Green Meadows, Hiranandani Gardens");
            customer.setPincode("400076");
            userRepository.save(customer);

            User customer2 = new User("john.doe@example.com", passwordEncoder.encode("customer123"), "John Doe", "+91 9123456780", Role.ROLE_CUSTOMER);
            customer2.setAddress("Tower B-1204, Royal Palms, Goregaon");
            customer2.setPincode("400065");
            userRepository.save(customer2);

            logger.info("Demo users created successfully (admin@dmart.com, staff@dmart.com, customer@dmart.com)");

            // 2. Seed Categories
            Category c1 = categoryRepository.save(new Category("Fruits & Vegetables", "fruits-vegetables", "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=60", "Farm-fresh organic fruits and crisp seasonal vegetables", 1));
            Category c2 = categoryRepository.save(new Category("Dairy, Bakery & Eggs", "dairy-bakery", "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60", "Fresh milk, paneer, artisan breads, butter and eggs", 2));
            Category c3 = categoryRepository.save(new Category("Staples, Rice & Dals", "staples-grains", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60", "Premium basmati rice, organic pulses, atta, and cooking oils", 3));
            Category c4 = categoryRepository.save(new Category("Snacks & Beverages", "snacks-beverages", "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500&auto=format&fit=crop&q=60", "Chocolates, biscuits, namkeen, premium coffees, and juices", 4));
            Category c5 = categoryRepository.save(new Category("Personal Care", "personal-care", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60", "Skin care, hair care, body soaps, and grooming essentials", 5));
            Category c6 = categoryRepository.save(new Category("Household & Cleaning", "household", "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=60", "Detergents, dishwash liquids, disinfectants, and paper towels", 6));

            // 3. Seed Products
            List<Product> products = new ArrayList<>();

            // Fruits & Vegetables
            products.add(new Product("Fresh Alphonso Mangoes", "Sweet, aromatic Ratnagiri Alphonso mangoes, hand-picked from orchards.", "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=60", c1, "DMart Fresh", new BigDecimal("799.00"), new BigDecimal("599.00"), "1 Dozen (12 pcs)", 35, true, "5 Days"));
            products.add(new Product("Organic Royal Gala Apples", "Crisp, sweet, and juicy imported Royal Gala Apples rich in antioxidants.", "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60", c1, "DMart Fresh", new BigDecimal("240.00"), new BigDecimal("179.00"), "1 kg (approx 4-5 pcs)", 50, true, "7 Days"));
            products.add(new Product("Farm Fresh Red Onions", "Naturally grown firm red onions directly sourced from farmers in Nashik.", "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60", c1, "DMart Fresh", new BigDecimal("60.00"), new BigDecimal("39.00"), "1 kg", 120, true, "14 Days"));
            products.add(new Product("Fresh Farm Tomatoes", "Plump, ripe red hybrid tomatoes ideal for curries, salads, and soups.", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60", c1, "DMart Fresh", new BigDecimal("50.00"), new BigDecimal("28.00"), "1 kg", 90, true, "5 Days"));
            products.add(new Product("Organic Baby Spinach", "Tender and washed organic baby spinach leaves, rich in iron and vitamins.", "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60", c1, "DMart Fresh", new BigDecimal("45.00"), new BigDecimal("25.00"), "250 g", 40, true, "3 Days"));

            // Dairy & Bakery
            products.add(new Product("Amul Taaza Homogenised Milk", "Toned fresh milk packed with calcium and protein. Tetra pack with long shelf life.", "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=60", c2, "Amul", new BigDecimal("74.00"), new BigDecimal("68.00"), "1 Litre", 100, true, "90 Days"));
            products.add(new Product("Amul Salted Butter", "Delicious creamy salted butter made from pure milk fat. India's favorite breakfast spread.", "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60", c2, "Amul", new BigDecimal("275.00"), new BigDecimal("245.00"), "500 g", 60, false, "6 Months"));
            products.add(new Product("Fresh Malai Paneer", "Soft, melt-in-mouth cottage cheese paneer block for curries and tikkas.", "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60", c2, "Mother Dairy", new BigDecimal("120.00"), new BigDecimal("95.00"), "200 g", 25, true, "10 Days"));
            products.add(new Product("100% Whole Wheat Brown Bread", "Nutritious multi-grain whole wheat sandwich bread baked fresh with high dietary fiber.", "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60", c2, "Modern", new BigDecimal("55.00"), new BigDecimal("42.00"), "400 g", 30, true, "4 Days"));
            products.add(new Product("Farm Fresh White Eggs", "Protein-rich antibiotic-free grade A white eggs packed with essential amino acids.", "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=60", c2, "DMart Fresh", new BigDecimal("95.00"), new BigDecimal("75.00"), "Pack of 12", 45, true, "21 Days"));

            // Staples & Grains
            products.add(new Product("Fortune Sunlite Refined Sunflower Oil", "Light and healthy cooking oil enriched with vitamins A, D & E.", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60", c3, "Fortune", new BigDecimal("185.00"), new BigDecimal("138.00"), "1 Litre Pouch", 85, false, "9 Months"));
            products.add(new Product("India Gate Super Basmati Rice", "Aged long grain aromatic basmati rice for royal biryanis and pulavs.", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60", c3, "India Gate", new BigDecimal("650.00"), new BigDecimal("489.00"), "5 kg Bag", 40, false, "24 Months"));
            products.add(new Product("Aashirvaad Shudh Chakki Atta", "100% pure whole wheat flour processed with traditional chakki grinding.", "https://images.unsplash.com/photo-1627483262268-9c2b5b2834b5?w=500&auto=format&fit=crop&q=60", c3, "Aashirvaad", new BigDecimal("260.00"), new BigDecimal("215.00"), "5 kg Bag", 65, false, "6 Months"));
            products.add(new Product("Tata Sampann Unpolished Toor Dal", "Naturally protein-rich unpolished toor dal without artificial coloring.", "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=60", c3, "Tata Sampann", new BigDecimal("190.00"), new BigDecimal("149.00"), "1 kg Pouch", 55, false, "12 Months"));
            products.add(new Product("Tata Salt Vacuum Evaporated", "Iodized crystal pure cooking salt, the country's trusted kitchen staple.", "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&auto=format&fit=crop&q=60", c3, "Tata", new BigDecimal("28.00"), new BigDecimal("24.00"), "1 kg Pouch", 150, false, "24 Months"));

            // Snacks & Beverages
            products.add(new Product("Cadbury Dairy Milk Silk Chocolate", "Creamy, smooth, and indulgent milk chocolate bar that melts in your mouth.", "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=500&auto=format&fit=crop&q=60", c4, "Cadbury", new BigDecimal("180.00"), new BigDecimal("145.00"), "150 g", 70, false, "12 Months"));
            products.add(new Product("Nescafe Classic Instant Coffee", "100% pure natural robusta coffee granules with signature bold aroma.", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60", c4, "Nescafe", new BigDecimal("340.00"), new BigDecimal("265.00"), "200 g Jar", 45, false, "18 Months"));
            products.add(new Product("Lay's Classic Salted Potato Chips", "Crispy golden thinly sliced potato chips sprinkled with sea salt.", "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60", c4, "Lays", new BigDecimal("50.00"), new BigDecimal("38.00"), "90 g Party Pack", 80, false, "4 Months"));
            products.add(new Product("Real 100% Mixed Fruit Juice", "Pure nutritious fruit juice packed with natural goodness and vitamin C.", "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=60", c4, "Real", new BigDecimal("130.00"), new BigDecimal("99.00"), "1 Litre Tetra Pack", 50, false, "6 Months"));

            // Personal Care
            products.add(new Product("Dove Deep Moisture Body Wash", "Sulfate-free nourishing body wash with 24hr microbiome protection.", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60", c5, "Dove", new BigDecimal("399.00"), new BigDecimal("279.00"), "800 ml Pump Bottle", 30, false, "36 Months"));
            products.add(new Product("Head & Shoulders Smooth & Silky Shampoo", "Anti-dandruff daily shampoo leaving hair shiny, soft and 100% flake-free.", "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&auto=format&fit=crop&q=60", c5, "Head & Shoulders", new BigDecimal("440.00"), new BigDecimal("320.00"), "650 ml Bottle", 35, false, "24 Months"));
            products.add(new Product("Colgate MaxFresh Peppermint Toothpaste", "Cooling crystals toothpaste providing intense icy fresh breath.", "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&auto=format&fit=crop&q=60", c5, "Colgate", new BigDecimal("190.00"), new BigDecimal("142.00"), "Pack of 2 (300g)", 90, false, "24 Months"));

            // Household & Cleaning
            products.add(new Product("Surf Excel Matic Top Load Detergent", "Powerful liquid detergent specifically formulated for machine washing.", "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=500&auto=format&fit=crop&q=60", c6, "Surf Excel", new BigDecimal("460.00"), new BigDecimal("345.00"), "2 Litre Bottle", 20, false, "24 Months"));
            products.add(new Product("Vim Lemon Dishwash Liquid Gel", "Degreasing lemon power gel that cleans tough oily vessels effortlessly.", "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&auto=format&fit=crop&q=60", c6, "Vim", new BigDecimal("210.00"), new BigDecimal("155.00"), "750 ml Bottle", 75, false, "24 Months"));
            products.add(new Product("Lizol Disinfectant Surface Cleaner Citrus", "Kills 99.9% germs and removes tough stains with pleasant citrus aroma.", "https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?w=500&auto=format&fit=crop&q=60", c6, "Lizol", new BigDecimal("320.00"), new BigDecimal("249.00"), "2 Litre Bottle", 40, false, "24 Months"));

            productRepository.saveAll(products);
            logger.info("Saved {} grocery products into catalog", products.size());

            // 4. Seed Pickup Slots (Today, Tomorrow, Day After Tomorrow)
            LocalDate today = LocalDate.now();
            List<PickupSlot> slots = new ArrayList<>();

            String[] stores = {
                    "DMart Ready - Powai Link Hub",
                    "DMart Supercenter - Andheri West",
                    "DMart Express - Malad Central"
            };

            for (String store : stores) {
                for (int dayOffset = 0; dayOffset <= 3; dayOffset++) {
                    LocalDate slotDate = today.plusDays(dayOffset);
                    slots.add(new PickupSlot(store, "Sector 14, Main Avenue", slotDate, LocalTime.of(9, 0), LocalTime.of(11, 0), 10));
                    slots.add(new PickupSlot(store, "Sector 14, Main Avenue", slotDate, LocalTime.of(11, 30), LocalTime.of(13, 30), 10));
                    slots.add(new PickupSlot(store, "Sector 14, Main Avenue", slotDate, LocalTime.of(14, 0), LocalTime.of(16, 0), 10));
                    slots.add(new PickupSlot(store, "Sector 14, Main Avenue", slotDate, LocalTime.of(16, 30), LocalTime.of(18, 30), 10));
                    slots.add(new PickupSlot(store, "Sector 14, Main Avenue", slotDate, LocalTime.of(19, 0), LocalTime.of(21, 0), 10));
                }
            }
            pickupSlotRepository.saveAll(slots);
            logger.info("Saved {} scheduled store pickup slots", slots.size());

            // 5. Seed a Sample Order for Customer
            Order sampleOrder = new Order();
            sampleOrder.setUser(customer);
            sampleOrder.setFulfillmentType(FulfillmentType.HOME_DELIVERY);
            sampleOrder.setStatus(OrderStatus.DELIVERED);
            sampleOrder.setOrderNumber("DM-20260821-4821");
            sampleOrder.setDeliveryAddress("Flat 402, Green Meadows, Hiranandani Gardens");
            sampleOrder.setDeliveryPhone("+91 9765432109");
            sampleOrder.setDeliveryPincode("400076");
            sampleOrder.setPaymentMethod(PaymentMethod.UPI);
            sampleOrder.setPaymentStatus(PaymentStatus.PAID);
            sampleOrder.setCreatedAt(LocalDateTime.now().minusDays(2));

            OrderItem o1 = new OrderItem(products.get(1), 2); // Apples
            OrderItem o2 = new OrderItem(products.get(11), 1); // Basmati Rice
            OrderItem o3 = new OrderItem(products.get(15), 3); // Silk Chocolate

            sampleOrder.addItem(o1);
            sampleOrder.addItem(o2);
            sampleOrder.addItem(o3);

            BigDecimal totalMrp = o1.getMrp().multiply(BigDecimal.valueOf(2))
                    .add(o2.getMrp().multiply(BigDecimal.valueOf(1)))
                    .add(o3.getMrp().multiply(BigDecimal.valueOf(3)));
            BigDecimal subtotal = o1.getSubtotal().add(o2.getSubtotal()).add(o3.getSubtotal());

            sampleOrder.setTotalMrp(totalMrp);
            sampleOrder.setTotalDiscount(totalMrp.subtract(subtotal));
            sampleOrder.setDeliveryFee(BigDecimal.ZERO);
            sampleOrder.setFinalAmount(subtotal);

            orderRepository.save(sampleOrder);

            // Seed an active in-progress pickup order
            Order activeOrder = new Order();
            activeOrder.setUser(customer);
            activeOrder.setFulfillmentType(FulfillmentType.STORE_PICKUP);
            activeOrder.setStatus(OrderStatus.PREPARING);
            activeOrder.setOrderNumber("DM-20260823-1194");
            activeOrder.setPickupSlot(slots.get(1));
            activeOrder.setPaymentMethod(PaymentMethod.WALLET);
            activeOrder.setPaymentStatus(PaymentStatus.PAID);
            activeOrder.setCreatedAt(LocalDateTime.now().minusHours(1));

            OrderItem a1 = new OrderItem(products.get(5), 2); // Amul Taaza Milk
            OrderItem a2 = new OrderItem(products.get(12), 1); // Atta
            activeOrder.addItem(a1);
            activeOrder.addItem(a2);

            BigDecimal aMrp = a1.getMrp().multiply(BigDecimal.valueOf(2)).add(a2.getMrp().multiply(BigDecimal.valueOf(1)));
            BigDecimal aSubtotal = a1.getSubtotal().add(a2.getSubtotal());
            activeOrder.setTotalMrp(aMrp);
            activeOrder.setTotalDiscount(aMrp.subtract(aSubtotal));
            activeOrder.setDeliveryFee(BigDecimal.ZERO);
            activeOrder.setFinalAmount(aSubtotal);

            orderRepository.save(activeOrder);
            logger.info("Sample grocery orders seeded successfully!");
        }
    }
}
