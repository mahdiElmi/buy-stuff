const postsData = [
  {
    id: 0,
    title: "The Joy of Minimalism: Simplifying Your Life for Happiness",
    description:
      "Discover the liberating benefits of minimalism and learn practical tips to declutter your space, reduce stress, and embrace a more intentional lifestyle.",
    timeToRead: 9,
    author: {
      name: "Emily Johnson",
      role: "Lifestyle Coach",
    },
  },
  {
    id: 1,
    title: "The Art of Effective Communication: Building Stronger Connections",
    description:
      "Explore the essential elements of effective communication and gain insights on how to improve your relationships, enhance teamwork, and express yourself with clarity.",
    timeToRead: 11,
    author: {
      name: "Michael Thompson",
      role: "Communication Expert",
    },
  },
  {
    id: 2,
    title: "Embracing Self-Care: Nurturing Your Well-Being",
    description:
      "Dive into the world of self-care and discover practical strategies to prioritize your mental, emotional, and physical well-being, fostering a healthier and happier you.",
    timeToRead: 7,
    author: {
      name: "Sarah Wilson",
      role: "Wellness Consultant",
    },
  },
  {
    id: 3,
    title: "Unleashing Creativity: Igniting Your Inner Artist",
    description:
      "Tap into your creative potential and explore various techniques, tools, and inspirations to express yourself artistically, whether through painting, writing, photography, or other mediums.",
    timeToRead: 13,
    author: {
      name: "David Roberts",
      role: "Creative Director",
    },
  },
  {
    id: 4,
    title: "Adventures in Culinary Delights: Exploring Global Cuisine",
    description:
      "Embark on a culinary journey as we delve into diverse and delicious recipes from around the world, sharing cultural insights and mouthwatering dishes to inspire your own kitchen adventures.",
    timeToRead: 10,
    author: {
      name: "Julia Garcia",
      role: "Food Blogger",
    },
  },
  {
    id: 5,
    title: "Finding Zen in Nature: Embracing the Healing Power of the Outdoors",
    description:
      "Discover the restorative effects of spending time in nature, from soothing forest walks to awe-inspiring mountaintop views, and learn how to connect with the natural world for inner peace and rejuvenation.",
    timeToRead: 8,
    author: {
      name: "Jack Smith",
      role: "Outdoor Enthusiast",
    },
  },
  {
    id: 6,
    title: "Mastering Time Management: Maximizing Productivity in a Busy World",
    description:
      "Gain practical strategies and proven techniques to optimize your time, increase productivity, and achieve a better work-life balance, allowing you to make the most of every day.",
    timeToRead: 12,
    author: {
      name: "Olivia Chen",
      role: "Productivity Coach",
    },
  },
  {
    id: 7,
    title:
      "The Science of Happiness: Unveiling the Secrets to a Fulfilling Life",
    description:
      "Explore the science-backed strategies for cultivating happiness and well-being, from gratitude practices and positive psychology techniques to mindfulness exercises and meaningful connections.",
    timeToRead: 14,
    author: {
      name: "Dr. Ryan Williams",
      role: "Positive Psychology Researcher",
    },
  },
  {
    id: 8,
    title: "Travel Tales: Inspiring Journeys from Around the Globe",
    description:
      "Embark on virtual adventures as we share captivating travel stories, breathtaking destinations, and insightful tips to help you plan your next memorable trip and create your own travel tales.",
    timeToRead: 6,
    author: {
      name: "Sophia Lee",
      role: "Travel Writer",
    },
  },
  {
    id: 9,
    title: "Unleashing Your Inner Entrepreneur: Building a Successful Startup",
    description:
      "Dive into the world of entrepreneurship as we explore startup stories, share business insights, and provide practical guidance to help you navigate the challenges and turn your ideas into a thriving venture.",
    timeToRead: 15,
    author: {
      name: "Alex Rodriguez",
      role: "Startup Founder",
    },
  },
  {
    id: 10,
    title: "The Power of Positive Thinking",
    description:
      "Discover the transformative effects of positive thinking and how it can improve your overall well-being and success in various aspects of life. Learn practical tips and techniques to cultivate a positive mindset and overcome challenges with optimism.",
    timeToRead: 10,
    author: {
      name: "Jessica Brown",
      role: "Life Coach",
    },
  },
  {
    id: 11,
    title: "Mastering Time Management: Boost Productivity and Reduce Stress",
    description:
      "Learn effective strategies for managing your time efficiently to enhance productivity, accomplish tasks more effectively, and reduce stress levels. Explore proven techniques such as prioritization, goal-setting, and optimizing your daily routines.",
    timeToRead: 9,
    author: {
      name: "James Davis",
      role: "Productivity Expert",
    },
  },
];

export type PostDataType = (typeof postsData)[0];

export default postsData;
