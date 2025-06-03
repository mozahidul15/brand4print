// Sample product data for testing bag customization features
export const sampleBagProducts = [
  {
    _id: "pd-001",
    title: "Custom Printed Take Away White Paper Bags",
    sku: "BAG-COTTON-001",
    short_description: "Brand4Print specializes in custom printing on paper bags in Enfield, offering personalized branding solutions for businesses. Elevate your brand with our bespoke printed paper bags today!",
    description: "Elevate your brand’s image and leave a lasting impression with our premium Custom Printed Take Away White Paper Bags. Designed for takeaways, restaurants, and retail stores, these eco-friendly bags offer the perfect blend of style and functionality.Our Custom Printed Take Away White Paper Bags provide a blank canvas for showcasing your brand logo, message, and unique designs. Made from high-quality materials, they are durable, sturdy, and ensure safe packaging for your products.Choose from a range of customization options to tailor these paper bags to your specific needs. Whether you’re serving meals, selling merchandise, or promoting special events, our custom printed bags are the ideal solution for your branding needs.With our state-of-the-art printing technology, we can reproduce intricate designs, vibrant colors, and crisp text to ensure that your branding stands out. Whether you prefer a minimalist logo or a bold, eye-catching design, our printing capabilities can bring your vision to life.But that’s not all! Our Custom Printed Take Away White Paper Bags are also environmentally friendly. Made from sustainably sourced materials and recyclable after use, they help reduce your carbon footprint and demonstrate your commitment to sustainability.Furthermore, our paper bags are designed with practicality in mind. The spacious interior provides ample room for a variety of items, while the sturdy handles ensure comfortable carrying for your customers. Whether it’s hot food, cold drinks, or delicate merchandise, our bags offer reliable protection and convenient transport.Experience the difference of our Custom Printed Take Away White Paper Bags today. Order now and make a lasting impression on your customers with our premium quality bags. With fast turnaround times, competitive pricing, and exceptional customer service, we make it easy for you to elevate your brand’s image and enhance your customer experience.",
    price: 15.99,
    minPrice: 300.00,
    maxPrice: 3000.00,
    images: [
      "/pd-1.jpg",
      "/pd-1-1.jpg",
      "/pd-1-2.jpg"
    ],
    mainImage: "/pd-1.jpg",
    thumbnails: [
      "/pd-1.jpg",
      "/pd-1-1.jpg",
      "/pd-1-2.jpg"
    ],
    productType: "bag",
    customizable: true,
    inStock: true,
    options: {
      bagSizes: [

        { id: "large", label: "Large (29x14x26cm)" },

      ],
      printColors: [
        { id: "one-color-one-side", label: "1 Color, 1 Side" },
        { id: "one-color-two-sides", label: "1 Color, 2 Sides" },
        { id: "two-color-one-side", label: "2 Colors, 1 Side" },
        { id: "two-color-two-sides", label: "2 Colors, 2 Sides" }
      ],
      quantity: [1000, 2500, 5000, 10000],
    },
    mockupImages: {
      front: 'public\mockups\white-paper-bags.jpg',
      back: 'public\mockups\white-paper-bags.jpg'
    },
  },
  {
    _id: "pd-002",
    title: "Custom Printed Take Away Brown Paper Bags",
    sku: "BAG-JUTE-001",
    short_description: "Natural jute shopping bag with cotton handles. Sustainable and perfect for branding.",
    description: "Our Custom Printed Take Away Brown Paper Bags provide a blank canvas for showcasing your brand logo, message, and unique designs. Made from high-quality materials, they are durable, sturdy, and ensure safe packaging for your products.Choose from a range of customization options to tailor these paper bags to your specific needs. Whether you’re serving meals, selling merchandise, or promoting special events, our custom printed bags are the ideal solution for your branding needs.With our state-of-the-art printing technology, we can reproduce intricate designs, vibrant colors, and crisp text to ensure that your branding stands out. Whether you prefer a minimalist logo or a bold, eye-catching design, our printing capabilities can bring your vision to life.But that’s not all! Our Custom Printed Take Away Brown Paper Bags are also environmentally friendly. Made from sustainably sourced materials and recyclable after use, they help reduce your carbon footprint and demonstrate your commitment to sustainability.Furthermore, our paper bags are designed with practicality in mind. The spacious interior provides ample room for a variety of items, while the sturdy handles ensure comfortable carrying for your customers. Whether it’s hot food, cold drinks, or delicate merchandise, our bags offer reliable protection and convenient transport.Experience the difference of our Custom Printed Take Away Brown Paper Bags today. Order now and make a lasting impression on your customers with our premium quality bags. With fast turnaround times, competitive pricing, and exceptional customer service, we make it easy for you to elevate your brand’s image and enhance your customer experience.",
    price: 18.99,
    minPrice: 200.00,
    maxPrice: 2700.00,
    images: [
      "https://brand4print.co.uk/wp-content/uploads/2024/02/brown-paper_Bag.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/03/paper-bag_size_ok-1306x1536.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/03/small-1306x1536.jpg"
    ],
    mainImage: "https://brand4print.co.uk/wp-content/uploads/2024/02/brown-paper_Bag.jpg",
    thumbnails: [
      "https://brand4print.co.uk/wp-content/uploads/2024/02/brown-paper_Bag.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/03/paper-bag_size_ok-1306x1536.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/03/small-1306x1536.jpg"
    ],
    productType: "bag",
    customizable: true,
    inStock: true,
    options: {
      bagSizes: [
        { id: "standard", label: "Standard (18x9x21cm)" },
        { id: "medium", label: "Medium (22x11x25cm)" },
        { id: "large", label: "Large (29x14x26cm)" },
        { id: "extra-large", label: "Extra Large (35x21x32cm)" }
      ],
      printColors: [
        { id: "one-color-one-side", label: "1 Color, 1 Side" },
        { id: "one-color-two-sides", label: "1 Color, 2 Sides" },
        { id: "two-color-one-side", label: "2 Colors, 1 Side" },
        {
          id: "two-color-two-sides",
          label: "2 Colors, 2 Sides"
        }
      ],
      quantity: [1000, 2500, 5000, 10000],
    },

    mockupImages: {
      front: '/white-paper-bags.jpg',
      back: '/white-paper-bags.jpg'
    },
  },
  {
    _id: "pd-003",
    title: "Create Personalized and Eye-Catching Designs with Our Vinyl Stickers",
    sku: "BAG-CANVAS-MESSENGER-001",
    short_description: "Heavy-duty canvas messenger bag with adjustable strap. Professional and durable.",
    description: "Elevate your brand’s image and make a lasting impression with our premium Custom Printed Vinyl Stickers. Crafted for businesses, events, and personal use, these versatile stickers offer a blend of style and functionality.Our Custom Printed Vinyl Stickers provide a creative platform for showcasing your brand logo, message, and unique designs.Constructed from high- quality vinyl material, they are durable, weather - resistant, and ensure long - lasting adhesion on various surfaces.Choose from a wide range of customization options to tailor these stickers to your specific needs.Whether you’re promoting products, enhancing packaging, or decorating spaces, our custom printed stickers are the perfect solution for your branding requirements.With our advanced printing technology, we can reproduce intricate designs, vibrant colors, and sharp details to ensure that your branding stands out.Whether you opt for a minimalist approach or a bold, eye - catching design, our printing capabilities can bring your vision to life.But that’s not all! Our Custom Printed Vinyl Stickers are also environmentally friendly.Manufactured using eco-conscious materials and inks, they are recyclable and contribute to reducing environmental impact.Furthermore, our stickers are designed for practicality and versatility.They adhere smoothly to surfaces like glass, metal, plastic, and paper, offering endless possibilities for creative applications.Whether it’s for promotional campaigns, product labeling, or personal expression, our stickers deliver reliable performance and aesthetic appeal.Experience the difference of our Custom Printed Vinyl Stickers today.Order now and make a lasting impression on your audience with our premium quality stickers.With quick turnaround times, competitive pricing, and dedicated customer service, we ensure a seamless experience to help you elevate your brand and engage your audience effectively.Enhance your brand’s visibility and create memorable experiences with our Custom Printed Vinyl Stickers.From product packaging to event promotion, our versatile stickers are designed to leave a lasting impression.Explore our wide range of design options and customization features to create stickers that perfectly represent your brand’s identity and message.With durable materials and vibrant printing, our stickers ensure that your branding stands out in any setting.Order now and elevate your brand with our premium quality Custom Printed Vinyl Stickers.",
    price: 16.00,

    images: [
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker-vinyl1.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker_tanks-1024x1024.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker_aa-1152x1536.jpg"
    ],
    mainImage: "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker-vinyl1.jpg",
    thumbnails: [
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker-vinyl1.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker_tanks-1024x1024.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker_aa-1152x1536.jpg"
    ],
    productType: "sticker",
    customizable: false,
    inStock: true,
    options: {

      shapes: [
        { id: "circle", label: "Circle" },
        { id: "squire", label: "Squire" },
        { id: "rectangle", label: "Rectangle" },
        { id: "star", label: "Star" }
      ],

      quantity: [50, 100, 250, 500, 1000, 2500, 5000, 10000],
    },
  },
  {
    _id: "pd-004",
    title: "Unleash Your Creativity with Premium Paper Stickers",
    sku: "BAG-NONWOVEN-001",
    short_description: "Lightweight non-woven promotional bag. Cost-effective for large quantity orders.",
    description: "Elevate your brand’s image and make a lasting impression with our premium Custom Printed Paper Stickers. Crafted for businesses, events, and personal use, these versatile stickers offer a blend of style and functionality.Our Custom Printed Paper Stickers provide a creative platform for showcasing your brand logo, message, and unique designs. Constructed from high-quality paper material, they are durable, weather-resistant, and ensure long-lasting adhesion on various surfaces.Choose from a wide range of customization options to tailor these stickers to your specific needs. Whether you’re promoting products, enhancing packaging, or decorating spaces, our custom printed stickers are the perfect solution for your branding requirements.With our advanced printing technology, we can reproduce intricate designs, vibrant colors, and sharp details to ensure that your branding stands out. Whether you opt for a minimalist approach or a bold, eye-catching design, our printing capabilities can bring your vision to life.But that’s not all! Our Custom Printed Paper Stickers are also environmentally friendly. Manufactured using eco-conscious materials and inks, they are recyclable and contribute to reducing environmental impact.Furthermore, our stickers are designed for practicality and versatility. They adhere smoothly to surfaces like glass, metal, plastic, and paper, offering endless possibilities for creative applications. Whether it’s for promotional campaigns, product labeling, or personal expression, our stickers deliver reliable performance and aesthetic appeal.Experience the difference of our Custom Printed Paper Stickers today. Order now and make a lasting impression on your audience with our premium quality stickers. With quick turnaround times, competitive pricing, and dedicated customer service, we ensure a seamless experience to help you elevate your brand and engage your audience effectively.",
    price: 16.00,
    images: [
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker-paper.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/02/paper_sticker_a.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker_aa.jpg"
    ],
    mainImage: "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker-paper.jpg",
    thumbnails: [
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker-paper.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/02/paper_sticker_a.jpg",
      "https://brand4print.co.uk/wp-content/uploads/2024/02/sticker_aa.jpg"
    ],
    productType: "sticker",
    customizable: false,
    inStock: true,
    options: {
      shapes: [
        { id: "circle", label: "Circle" },
        { id: "squire", label: "Squire" },
        { id: "rectangle", label: "Rectangle" },
        { id: "star", label: "Star" }
      ],

      quantity: [50, 100, 250, 500, 1000, 2500, 5000, 10000],

    },

  }
];


