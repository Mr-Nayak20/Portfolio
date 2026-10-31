export const profile = {
  name: 'Shivansh Nayak',
  mark: 'Shivansh Nayak',
  identity: 'Vigilant. Smart. Stubborn.',
  email: 'shivansh15nayak@gmail.com',
  place: 'India',
  zone: 'Asia/Kolkata',
  zoneLabel: 'IST',
  socials: [
    ['GitHub', 'https://github.com/Mr-Nayak20'],
    ['LinkedIn', 'https://www.linkedin.com/in/shivansh-nayak'],
    ['Substack', 'https://shivanshnayak.substack.com']
  ],
  status: [
    'A considered approach to websites, AI agents and automation.',
    'Explore the studies, or get in touch about your next project.',
    'Vigilant. Smart. Stubborn.'
  ]
};

export const services = [
  {
    id: 'websites',
    name: 'Website development',
    image: 'velocity',
    poster: '/media/websites.png',
    line: 'Websites with purpose, presence and a clear way forward.',
    body: 'I build websites from the first layout to the finished experience: front end, back end, and e-commerce. Structure, typography and motion serve the same purpose — helping people understand the business and take the next step.',
    items: [
      ['Interactive pages', 'Interfaces that respond clearly to the person using them.'],
      ['Editorial layout', 'Typography, images and structure arranged around the message.'],
      ['Motion', 'Measured transitions and interaction, with attention to loading and reduced motion.'],
      ['Front-end build', 'Responsive layouts, accessible controls and careful implementation.'],
      ['Study sites', 'Interactive studies, with their open-source foundations credited.']
    ]
  },
  {
    id: 'software',
    name: 'Software',
    image: 'monolith',
    poster: 'https://images.pexels.com/photos/3987066/pexels-photo-3987066.jpeg?auto=compress&cs=tinysrgb&w=2560',
    line: 'Software shaped around the people who use it.',
    body: 'I turn a product idea into a clear, usable interface. The work begins with the task at hand, then follows it through: the right information, sensible controls, and careful attention to what happens when something goes wrong.',
    items: [
      ['Product screens', 'A considered path from opening an application to completing the task.'],
      ['States', 'Clear responses when a task is loading, complete, empty or unsuccessful.'],
      ['Prototypes', 'Clickable or running, so a decision can be made on the real behaviour.'],
      ['Design systems', 'Type, space, and components that stay put when a second screen arrives.'],
      ['Handoff', 'Clear specifications and working prototypes for the next stage of development.']
    ]
  },
  {
    id: 'ai',
    name: 'Intelligent systems',
    image: 'nocturne',
    poster: 'https://images.pexels.com/photos/7988114/pexels-photo-7988114.jpeg?auto=compress&cs=tinysrgb&w=2560',
    line: 'Thoughtful intelligence for the work that matters.',
    body: 'I create intelligent tools that make complex work feel simpler. From focused assistants to connected workflows, each system is shaped around a real task and the people doing it.',
    items: [
      ['AI agents', 'Task-focused assistants designed around your workflow.'],
      ['Automation', 'Connect repeatable steps and reduce manual work.'],
      ['In-browser models', 'Summaries and image captions processed locally after the model downloads.'],
      ['Brief', 'A long page goes in. A short brief comes out.'],
      ['Tone', 'The same line, said in another voice, without sending it away.'],
      ['Sight', 'An image, described on the device that is looking at it.'],
      ['Voice', 'Speech recognition provided by the browser; audio may be processed remotely. Saved notes stay on this device.']
    ]
  },
  {
    id: 'writing',
    name: 'Writing & design',
    image: 'horologie',
    poster: 'https://images.pexels.com/photos/9222404/pexels-photo-9222404.jpeg?auto=compress&cs=tinysrgb&w=2560',
    line: 'Clear words. A distinct visual point of view.',
    body: 'I write and design with the same question in mind: what deserves the reader’s attention? From a headline to a visual identity, I give an idea a clear voice and a form that carries it well.',
    items: [
      ['Headlines', 'A clear opening line, supported by the detail the reader needs.'],
      ['Voice', 'A consistent voice across the product, its website and the details people remember.'],
      ['Visual identity', 'Colour, typography and visual rules that remain consistent across the work.'],
      ['Art direction', 'A clear purpose for each image, with colour, composition and context considered together.'],
      ['Page structure', 'A considered sequence from introduction and evidence to the next step.']
    ]
  }
].filter(service => ['websites', 'ai'].includes(service.id));

export const studies = [
  ['reliquary', 'Reliquary', 'A room you only see by the light you carry.', 'The dark is the interface. What you hold is the only lamp.', 'Websites', 'Study', 'Interactive'],
  ['abyssal', 'Abyssal', 'The page is a dive. You steer the lamps.', 'Depth is a scroll. The lights answer the pointer.', 'Websites', 'Study', 'Installation'],
  ['ember', 'Hammer & Ember', 'Steel takes colour from heat. Then you strike.', 'A study in sequence: heat, then the blow, then the colour left behind.', 'Websites', 'Study', 'Sequence'],
  ['terrarium', 'Bell & Moss', 'A climate under glass. Wipe the window.', 'The glass is the screen. The weather is the content.', 'Websites', 'Study', 'Scroll'],
  ['koi', 'Still Water', 'A pond that answers a fingertip.', 'Touch is the navigation. The water keeps the state.', 'Websites', 'Study', 'Touch'],
  ['florae', 'Florae', 'A field that moves when you do.', 'Motion follows the body, not a timer.', 'Websites', 'Study', 'Motion'],
  ['velocity', 'Velocity Lab', 'Look through the shoe: bone, heat, drawing.', 'A product, taken apart until the drawing shows.', 'Websites', 'Study', 'Product'],
  ['hangar', 'Hangar Nine', 'Hold, and a large machine wakes.', 'Scale is the point. The interaction is patience.', 'Websites', 'Study', 'Hold'],
  ['sucre', 'Maison Sucre', 'Sugar, weight, and a table. Nothing is for sale.', 'A still life with physics. There is no checkout.', 'Websites', 'Study', 'Still life'],
  ['monolith', 'Monolith', 'Drag the sun. The house changes its mind.', 'One control. The whole room renegotiates the light.', 'Websites', 'Study', 'Light'],
  ['lowfreq', 'Low Frequency', 'Put a hand on the record. It plays here.', 'Sound as a control, not a background track.', 'Websites', 'Study', 'Sound'],
  ['gambit', 'Gambit', 'A game replayed, then left in your hands.', 'Rules you can read, then break, on purpose.', 'Websites', 'Study', 'Play'],
  ['atlas', 'Atlas', 'Islands with air between them.', 'A map that refuses to be a grid of equal cards.', 'Websites', 'Study', 'Map'],
  ['lithos', 'Lithos', 'Hold the stone until it opens.', 'Time is the gesture. Letting go closes it.', 'Websites', 'Study', 'Hold'],
  ['artemis', 'Artemis', 'Scroll, and a figure walks where there is no weather.', 'The scroll is a path. The figure keeps your place.', 'Websites', 'Study', 'Figure'],
  ['keeper', 'The Keeper', 'Aim a beam through bad weather.', 'Attention is a flashlight. The rest of the scene waits.', 'Websites', 'Study', 'Light'],
  ['koen', 'Kōen', 'One tree. A year, in four breaths.', 'Seasons as chapters. No carousel.', 'Websites', 'Study', 'Time'],
  ['nocturne', 'Nocturne', 'Glass, liquid, and notes — a study, not a house.', 'A bottle, lit, and copy that does not pretend to sell it.', 'Websites', 'Study', 'Object'],
  ['racer', 'Nightshift', 'Rain, a bike, a throttle you have to hold.', 'If you let go, it slows. The page requires you.', 'Websites', 'Study', 'Hold'],
  ['horologie', 'Horologie', 'A movement, taken apart in the browser.', 'Parts, named, and the order they depend on.', 'Websites', 'Study', 'Exploded']
].map(([slug, name, line, note, discipline, year, tag]) => ({slug, name, line, note, discipline, year, tag}));

export const notes = [
  {
    "slug": "a-room-you-can-walk",
    "title": "A website is an experience",
    "dek": "What the interactive studies explore, and why the details matter.",
    "author": "Shivansh Nayak",
    "minutes": 2,
    "image": "reliquary",
    "body": [
      "A website begins before its first sentence. The scale of an image, the rhythm of the type and the way a page responds tell the visitor what sort of care has gone into it. I want those details to make the purpose clearer.",
      "The studies collected here explore a particular interaction each: moving a light through a museum, changing the sun over a house, or examining the construction of a shoe. Their foundations come from the open-source Dioramas collection and are credited throughout.",
      "A study gives an idea room to be tested. It is a place to examine what an interaction contributes, what it costs to load, and whether it remains useful on a smaller screen. These are experiments, rather than claims of commissioned client work.",
      "For a business website, the brief comes first. The choice of motion, layout or technology follows from the people using it and the decision they need to make. The finished work should make that decision easier."
    ]
  },
  {
    "slug": "tools-before-the-server",
    "title": "AI you can try for yourself",
    "dek": "Four tools, a clear purpose for each, and an honest account of how they run.",
    "author": "Shivansh Nayak",
    "minutes": 2,
    "image": "nocturne",
    "body": [
      "An AI tool ought to be understood through use. The tools here are small enough to try directly: Brief summarises text, Tone offers a different phrasing, Sight describes an image, and Voice captures a spoken note.",
      "Brief and Sight download model files before running inference in the browser. Tone starts with simple text transformations and offers an optional local model. The first model download can take time; speed depends on the connection and the device.",
      "These tools are demonstrations of a particular approach, rather than a substitute for an entire AI system. Their outputs need judgement. A summary can omit a qualification, and an image caption can be wrong. Sight identifies its simpler colour-based output when its vision model is unavailable.",
      "Voice uses the browser’s speech-recognition service, which may process audio remotely depending on the browser. Saved notes remain on the device. That distinction matters: privacy should be described accurately, not assumed from the interface.",
      "My wider interest is in agents and automation that take a useful task through to completion. The interface should let a person see what happened, correct it when necessary, and remain in control."
    ]
  },
  {
    "slug": "the-sentence-is-the-layout",
    "title": "Writing and design belong together",
    "dek": "The message deserves as much attention as the way it is presented.",
    "author": "Shivansh Nayak",
    "minutes": 2,
    "image": "florae",
    "body": [
      "Writing establishes what a page means. Design establishes the order in which it is understood. When they develop together, a heading can do the work of a paragraph and a well-chosen image can give a sentence its setting.",
      "I favour language that is direct, measured and specific. A business should be able to say what it offers without borrowing a grander vocabulary. Confidence comes from knowing the point, then making it clearly.",
      "The same care applies to visual identity. Typography, spacing and colour should have a relationship to the subject. A quiet page can feel assured; a more expressive one can still be precise.",
      "The aim is a coherent piece of work. What the visitor reads, sees and does should lead in the same direction."
    ]
  },
  {
    "slug": "what-a-study-is-for",
    "title": "Software begins with the task",
    "dek": "Useful interfaces are built around the work someone needs to finish.",
    "author": "Shivansh Nayak",
    "minutes": 2,
    "image": "horologie",
    "body": [
      "A product screen should make its purpose apparent. What can I do here? What information do I need? What happens next? These questions are a useful starting point for both design and development.",
      "The main flow is only part of the work. An empty account, a slow request, an invalid entry and a failed save all deserve an intelligible response. They are ordinary moments in the life of software.",
      "Automation adds another responsibility. A person should know which action has been proposed, which has been completed, and which still needs attention. A polished interface is valuable when it helps make those distinctions clear.",
      "I approach software as a sequence of decisions and consequences. The result should be straightforward to use and careful with the trust a person places in it."
    ]
  }
];

export const jobs = [
  ['Frontend collaborator', 'Remote', 'Interested in responsive interfaces, motion and WebGL? Share a project and the work you would like to explore together.'],
  ['Writing partner', 'Remote', 'Clear headlines, considered case notes and an interest in working closely with design.'],
  ['Design collaborator', 'Remote', 'Layout, identity, and the still frames the studies need when they leave the viewport.']
];

export const nav = [
  ['About', '/about/'],
  ['Services', '/services/'],
  ['Work', '/works/'],
  ['Websites', '/services/websites/'],
  ['Blog', '/blog/'],
  ['Archive', '/archives/'],
  ['Contact', '/contact/']
];



const freshCaptures = new Set(['reliquary', 'abyssal', 'ember', 'terrarium', 'koi', 'florae', 'velocity', 'hangar', 'sucre', 'monolith', 'lowfreq', 'gambit', 'atlas', 'lithos', 'artemis', 'keeper', 'koen', 'nocturne', 'racer', 'horologie']);
export const shot = slug => freshCaptures.has(slug) ? `/img/4k/${slug}-1920.webp` : `/img/index/${slug}.webp`;
export const shotWidth = slug => freshCaptures.has(slug) ? 1920 : 1280;
export const shotSrcset = slug => freshCaptures.has(slug)
  ? [640, 1280, 1920, 3840].map(width => `/img/4k/${slug}-${width}.webp ${width}w`).join(', ')
  : `/img/index/${slug}-320.webp 320w, /img/index/${slug}-640.webp 640w, /img/index/${slug}.webp 1280w`;

export function studyBySlug(slug) {
  return studies.find(s => s.slug === slug) || studies[0];
}

export function noteBySlug(slug) {
  return notes.find(n => n.slug === slug) || notes[0];
}
