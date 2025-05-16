"use client"
import React, { useEffect, useState } from 'react'
import Header from '../UI/Header/Header'
import LandingPageMain from './LandingPageMain'
import { usePathname, useSearchParams } from 'next/navigation'
import Loader from '../UI/Loader'

function LandingPage() {

    const userProfiles = [
        {
            "name": "Emily",
            "surname": "Johnson",
            "email": "emily.johnson@example.com",
            "username": "emilyjohnson123",
            "password": "Xd9#Ky2@Lm",
            "hobbies": [
                "Cooking",
                "Hiking",
                "Photography"
            ],
            "passions": [
                "Sustainable Living",
                "Traveling",
                "Learning New Languages"
            ],
            "bio": "Emily is a passionate environmentalist and avid traveler. She loves exploring new cultures and cuisines. In her free time, she enjoys capturing the beauty of nature through her camera lens.",
            "profilePicture": "https://randomuser.me/api/portraits/women/41.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 2,
            "pumpkins": 3,
            "dob": "1990-01-01",
            "joined": "2022-01-01",
            "gender": "Female",
            "city": "Manzini",
            "state": "MN",
            "country": "Eswatini",
            
        
        },
        {
            "name": "Michael",
            "surname": "Davis",
            "email": "michael.davis@example.com",
            "username": "mikedavis789",
            "password": "Qw3$Rt6%Yz",
            "hobbies": [
                "Reading",
                "Woodworking",
                "Gardening"
            ],
            "passions": [
                "History",
                "Sustainability",
                "Lifelong Learning"
            ],
            "bio": "Michael is a renaissance man with a diverse set of interests. He is an avid reader, a skilled woodworker, and a passionate gardener. He is deeply interested in history and sustainability.",
            "profilePicture": "https://randomuser.me/api/portraits/men/32.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 2,
            "pumpkins": 0,
            "dob": "1995-05-05",
            "joined": "2021-05-05",
            "gender": "Male",
            "city": "Lilongwe",
            "state": "MW",
            "country": "Malawi",
        },
        {
            "name": "Sophia",
            "surname": "Garcia",
            "email": "sophia.garcia@example.com",
            "username": "sophiagarcia456",
            "password": "Aa1&Bb2*Cc",
            "hobbies": [
                "Painting",
                "Yoga",
                "Volunteer Work"
            ],
            "passions": [
                "Art",
                "Mindfulness",
                "Community Service"
            ],
            "bio": "Sophia is a talented artist and a compassionate individual. She finds peace and inspiration through her painting and yoga practice. She is also deeply committed to making a positive impact in her community through volunteer work.",
            "profilePicture": "https://randomuser.me/api/portraits/women/19.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 0,
            "pumpkins": 3,
            "dob": "1998-08-08",
            "joined": "2020-08-08",
            "gender": "Female",
            "city": "Maputo",
            "state": "MZ",
            "country": "Mozambique",
        },
        {
            "name": "Jacob",
            "surname": "Gonzalez",
            "email": "jacob.gonzalez@example.com",
            "username": "jacobgonzalez321",
            "password": "Dd3#Ee4$Ff",
            "hobbies": [
                "Coding",
                "Cycling",
                "Astronomy"
            ],
            "passions": [
                "Technology",
                "Sustainability",
                "Exploring the Universe"
            ],
            "bio": "Jacob is a tech-savvy individual with a love for coding and cycling. He is also fascinated by the vastness of the universe and enjoys stargazing in his free time. He is committed to using technology to create a more sustainable future.",
            "profilePicture": "https://randomuser.me/api/portraits/men/12.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 0,
            "pumpkins": 4,
            "dob": "1997-07-07",
            "joined": "2021-07-07",
            "gender": "Male",
            "city": "Nairobi",
            "state": "KE",
            "country": "Kenya",
        },
        {
            "name": "Isabella",
            "surname": "Hernandez",
            "email": "isabella.hernandez@example.com",
            "username": "isabellahdz987",
            "password": "Gg5^Hh6&Ii",
            "hobbies": [
                "Dancing",
                "Baking",
                "Reading"
            ],
            "passions": [
                "Music",
                "Culinary Arts",
                "Literature"
            ],
            "bio": "Isabella is a vibrant and creative individual. She loves to express herself through dance and shares her passion for baking by creating delicious treats. She is also an avid reader and enjoys immersing herself in the world of literature.",
            "profilePicture": "https://randomuser.me/api/portraits/women/64.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 12,
            "pumpkins": 43,
            "dob": "1996-06-06",
            "joined": "2022-06-06",
            "gender": "Female",
            "city": "Accra",
            "state": "GH",
            "country": "Ghana",
        },
        {
            "name": "Ethan",
            "surname": "Ramirez",
            "email": "ethan.ramirez@example.com",
            "username": "ethanramirez123",
            "password": "Jj7*Kk8(Ll",
            "hobbies": [
                "Hiking",
                "Fishing",
                "Camping"
            ],
            "passions": [
                "Outdoor Adventure",
                "Wildlife Conservation",
                "Environmental Protection"
            ],
            "bio": "Ethan is an outdoor enthusiast who loves to explore the natural world. He finds solace in hiking, fishing, and camping, and is deeply passionate about wildlife conservation and environmental protection.",
            "profilePicture": "https://randomuser.me/api/portraits/men/29.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 6,
            "pumpkins": 13,
            "dob": "1995-05-05",
            "joined": "2021-05-05",
            "gender": "Male",
            "city": "Lagos",
            "state": "NS",
            "country": "Nigeria",
        },
        {
            "name": "Olivia",
            "surname": "Sanchez",
            "email": "olivia.sanchez@example.com",
            "username": "oliviasanchez456",
            "password": "Mm9#Nn0$Oo",
            "hobbies": [
                "Knitting",
                "Gardening",
                "Volunteering"
            ],
            "passions": [
                "Sustainable Crafting",
                "Organic Farming",
                "Social Activism"
            ],
            "bio": "Olivia is a passionate crafter and gardener who is committed to sustainable living. She enjoys knitting unique pieces and growing her own organic produce. She is also an active volunteer, dedicated to making a positive impact in her community.",
            "profilePicture": "https://randomuser.me/api/portraits/women/77.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 8,
            "pumpkins": 21,
            "dob": "1994-04-04",
            "joined": "2020-04-04",
            "gender": "Female",
            "city": "Cairo",
            "state": "EG",
            "country": "Egypt",
        },
        {
            "name": "Lucas",
            "surname": "Morales",
            "email": "lucas.morales@example.com",
            "username": "lucasmorales789",
            "password": "Pp1&Qq2*Rr",
            "hobbies": [
                "Playing Guitar",
                "Watching Movies",
                "Traveling"
            ],
            "passions": [
                "Music",
                "Film",
                "Cultural Exploration"
            ],
            "bio": "Lucas is a creative soul who finds joy in playing the guitar and immersing himself in the world of film. He is also an avid traveler, exploring new cultures and seeking inspiration from his adventures.",
            "profilePicture": "https://randomuser.me/api/portraits/men/45.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 10,  
            "pumpkins": 27,
            "dob": "1993-03-03",
            "joined": "2019-03-03",
            "gender": "Male",
            "city": "London",
            "state": "UK",
            "country": "United Kingdom",
        },
        {
            "name": "Ava",
            "surname": "Reyes",
            "email": "ava.reyes@example.com",
            "username": "avareyes321",
            "password": "Ss3#Tt4$Uu",
            "hobbies": [
                "Yoga",
                "Meditation",
                "Journaling"
            ],
            "passions": [
                "Mindfulness",
                "Self-Improvement",
                "Wellness"
            ],
            "bio": "Ava is a wellness enthusiast who practices yoga and meditation to maintain a balanced and centered lifestyle. She also finds solace in the act of journaling, using it as a tool for self-reflection and personal growth.",
            "profilePicture": "https://randomuser.me/api/portraits/women/41.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 12,
            "pumpkins": 29,
            "dob": "1992-02-02",
            "joined": "2018-02-02",
            "gender": "Female",
            "city": "Paris",
            "state": "FR",
            "country": "France",
        },
        {
            "name": "Daniel",
            "surname": "Gutierrez",
            "email": "daniel.gutierrez@example.com",
            "username": "danielgutierrez987",
            "password": "Vv5^Ww6&Xx",
            "hobbies": [
                "Painting",
                "Cooking",
                "Pottery"
            ],
            "passions": [
                "Fine Arts",
                "Culinary Exploration",
                "Ceramics"
            ],
            "bio": "Daniel is a versatile artist who finds expression through painting, cooking, and pottery. He is passionate about the fine arts and delves into the world of culinary exploration, creating unique and flavorful dishes. His love for ceramics allows him to sculpt and shape clay into beautiful works of art.",
            "profilePicture": "https://randomuser.me/api/portraits/men/32.jpg",
            "posts": [
                { "title": "My First Post", "content": "This is the content of my first post.", "likes": 2, "shares": 1, "comments": 1, "replies": 1, "views": 44, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546196/02_vdlmti.png" },
                { "title": "My Second Post", "content": "This is the content of my second post.", "likes": 4, "shares": 0, "comments": 6, "replies": 0, "views": 66, "image": "https://res.cloudinary.com/loooktrial/image/upload/v1720546198/01_yxcum8.png" },
            ],
            "hickies": 14,
            "pumpkins": 31,
            "dob": "1991-01-01",
            "joined": "2017-01-01",
            "gender": "Male",
            "city": "Berlin",
            "state": "DE",
            "country": "Germany",
            
        }
    ]

    // useEffect(() => {

    //     for (let i = 0; i < userProfiles.length; i++) {
    //         fetch("/api/auth", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(userProfiles[i]),
    //         })
    //             .then(async (response) => {
    //                 const result = await response.json();
    //                 console.log(result);
    //             })
    //             .catch((error) => {
    //                 console.error("Error:", error);
    //             });
    //     }

    // }, [])

    const [loader, setLoader] = useState(false);

    const pathname = usePathname()
    const searchParams = useSearchParams()
   
    useEffect(() => {
        setLoader(true);
        const timer = setTimeout(() => setLoader(false), 1000);
        return () => clearTimeout(timer);
      }, [pathname, searchParams]);
    
      if (loader) {
        return (
          <div className="relative items-center justify-center flex h-full w-full">
            <Loader />
          </div>
        );
      }
      
    return (
        <div className="flex w-full flex-col h-full">

            <LandingPageMain />
        </div>
    )
}

export default LandingPage