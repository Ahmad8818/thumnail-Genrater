import type { IPricing } from "../types";

// export const pricingData: IPricing[] = [
//     {
//         name: "Starter",
//         price: 29,
//         period: "500 credits",
//         features: [
//             "50 AI Thumbnails",
//             "Best for starters",
//             "Access to all AI models",
//             "No watermark on downloads",
//             "High-quality",
//             "Commercial usage allowed",
//             "Credits never expire",


//         ],
//         mostPopular: false
//     },
//     {
//         name: "Pro",
//         price: 79,
//         period: "2400 credits",
//         features: [
//             "240 AI Thumbnails",
//             "Best for intermediate",
//             "Access to all AI models",
//             "No watermark on downloads",
//             "High-quality",
//             "Commercial usage allowed",
//             "Credits never expire"
//         ],
//         mostPopular: true
//     },
//     {
//         name: "Ultra",
//         price: 199,
//         period: "8000 credits",
//         features: [
//             "800 AI Thumbnails",
//             "Best for professionals",
//             "Access to all AI models",
//             "No watermark on downloads",
//             "High-quality",
//             "Commercial usage allowed",
//             "Credits never expire",

//         ],
//         mostPopular: false
//     }
// ];



export const pricingData: IPricing[] = [
    {
        name: "Free",
        price: 0,
        period: "20 Free Credits",
        features: [
            "5 AI Thumbnails",
            "Best for starters",
            "Access to all AI models",
            "No watermark on downloads",
            "High-quality",
            "Commercial usage allowed",
            'Email support',


        ],
        mostPopular: false
    },
    {
        name: "Pro",
        price: 15,
        period: "Month",
        features: [
            "80 Monthly Credits",
            "80 AI Thumbnails",
            "Best for intermediate",
            "Access to all AI models",
            "No watermark on downloads",
            "High-quality",
            "Video generation",
            "Priority support",
        ],
        mostPopular: true
    },
    {
        name: "Ultra",
        price: 35,
        period: "month",
        features: [
            "240 Monthly Credit",
            "250 AI Thumbnails",
            "Best for professionals",
            "Access to all AI models",
            "No watermark on downloads",
            "High-quality",
            "Fast generation speed",
            "Chat + Email support",

        ],
        mostPopular: false
    }
];