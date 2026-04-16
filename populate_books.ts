import { db } from './src/firebase';
import { collection, addDoc, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';

const BOOKS = [
  {
    title: 'The Fault in Our Stars',
    author: 'John Green',
    genre: 'Young Adult',
    summary: 'Two teenage cancer patients begin a life-affirming journey to visit a reclusive author in Amsterdam.',
    fullOverview: 'The Fault in Our Stars is a poignant and powerful novel that explores the complexities of life, love, and mortality through the eyes of Hazel Grace Lancaster and Augustus Waters. Both teenagers are living with cancer, but their story is far from a typical "cancer book." Instead, it is a deeply philosophical and often humorous exploration of what it means to be alive. The novel follows their journey as they fall in love, travel to Amsterdam to meet a reclusive author, and grapple with the unfairness of their situations. Green\'s prose is both beautiful and accessible, capturing the raw emotions of adolescence and the profound questions that arise when faced with a terminal illness. The book has become a modern classic, celebrated for its honesty, wit, and heart-wrenching conclusion.',
    audience: 'Readers who enjoy emotional contemporary fiction, coming-of-age stories, and philosophical explorations of life and death.',
    ageRating: 'YA (14+)',
    coverUrl: 'https://picsum.photos/seed/fault/400/600'
  },
  {
    title: 'It Ends with Us',
    author: 'Colleen Hoover',
    genre: 'Romance',
    summary: 'Lily Bloom, a young woman who moves to Boston to open her own business, falls in love with a neurosurgeon named Ryle Kincaid.',
    fullOverview: 'It Ends with Us is a deeply personal and emotionally charged novel that tackles the difficult subject of domestic abuse with sensitivity and strength. The story follows Lily Bloom, a young woman who has worked hard to build a life for herself in Boston. When she meets Ryle Kincaid, a brilliant and ambitious neurosurgeon, she believes she has found the perfect partner. However, as their relationship progresses, Lily begins to see a side of Ryle that reminds her of her father\'s abusive behavior. The reappearance of her first love, Atlas Corrigan, further complicates her situation. Hoover masterfully explores the cycle of abuse, the difficulty of leaving a loved one, and the importance of breaking that cycle for future generations. It is a story of resilience, courage, and the power of making the right choice, even when it is the hardest one.',
    audience: 'Fans of emotional romance, contemporary drama, and stories dealing with complex family dynamics and personal strength.',
    ageRating: 'Adult (18+)',
    coverUrl: 'https://picsum.photos/seed/ends/400/600'
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    summary: 'A chilling prophecy about the future, where Big Brother is always watching and thoughtcrime is punishable by death.',
    fullOverview: '1984 is a seminal work of dystopian fiction that remains terrifyingly relevant today. Set in a future where the world is divided into three superstates, the novel follows Winston Smith, a low-ranking member of the Party in Oceania. The Party, led by the enigmatic Big Brother, maintains absolute control over its citizens through constant surveillance, propaganda, and the manipulation of language (Newspeak). Winston\'s secret rebellion against the Party\'s oppressive regime leads him on a dangerous journey of self-discovery and ultimate betrayal. Orwell\'s exploration of themes such as totalitarianism, surveillance, the erosion of truth, and the power of individual thought has made 1984 a cornerstone of modern literature. The novel serves as a stark warning against the dangers of unchecked power and the importance of intellectual freedom.',
    audience: 'Readers interested in political philosophy, dystopian futures, social commentary, and classic literature.',
    ageRating: 'Adult (16+)',
    coverUrl: 'https://picsum.photos/seed/1984/400/600'
  },
  {
    title: 'Looking for Alaska',
    author: 'John Green',
    genre: 'Young Adult',
    summary: 'Miles Halter is fascinated by famous last words and tired of his safe life at home. He leaves for boarding school to seek the "Great Perhaps."',
    fullOverview: 'Looking for Alaska is John Green\'s debut novel, a powerful and introspective coming-of-age story that resonates with readers of all ages. The novel follows Miles "Pudge" Halter, a teenager who is obsessed with famous last words and feels unfulfilled by his safe, predictable life. He decides to attend Culver Creek Boarding School in search of his "Great Perhaps." There, he meets the enigmatic and self-destructive Alaska Young, who pulls him into her world of pranks, poetry, and profound questions. The novel is divided into two parts, "Before" and "After," centered around a life-altering event that forces Miles and his friends to grapple with grief, guilt, and the search for meaning. Green\'s writing is sharp, witty, and deeply empathetic, capturing the intensity of teenage friendships and the enduring impact of those who change our lives forever.',
    audience: 'Teenagers and adults who appreciate introspective coming-of-age narratives and stories about friendship and loss.',
    ageRating: 'YA (14+)',
    coverUrl: 'https://picsum.photos/seed/alaska/400/600'
  },
  {
    title: 'Verity',
    author: 'Colleen Hoover',
    genre: 'Thriller',
    summary: 'Lowen Ashleigh is a struggling writer who accepts a job to finish a series for an injured bestselling author.',
    fullOverview: 'Verity is a dark and twisted psychological thriller that marks a departure from Colleen Hoover\'s typical romance novels. The story follows Lowen Ashleigh, a struggling writer who is hired by Jeremy Crawford to complete the remaining books in a successful series written by his wife, Verity, who has been severely injured in an accident. As Lowen delves into Verity\'s notes and unfinished manuscripts, she discovers a hidden autobiography that reveals a series of chilling and disturbing secrets about Verity\'s past and her relationship with her family. The novel is a masterclass in suspense, blurring the lines between truth and fiction, and keeping readers guessing until the very last page. It is a story of obsession, deception, and the dark corners of the human psyche.',
    audience: 'Fans of psychological thrillers, dark romance, and suspenseful mysteries with shocking twists.',
    ageRating: 'Adult (18+)',
    coverUrl: 'https://picsum.photos/seed/verity/400/600'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Satire',
    summary: 'A group of farm animals rebel against their human farmer, only to find themselves under a new form of tyranny.',
    fullOverview: 'Animal Farm is a brilliant and biting political allegory that uses a group of farm animals to satirize the events leading up to the Russian Revolution of 1917 and the subsequent Stalinist era of the Soviet Union. The story begins with the animals of Manor Farm rebelling against their neglectful human owner, Mr. Jones, in hopes of creating a society where all animals are equal and free. However, the pigs, led by Napoleon and Snowball, gradually seize power and establish a new hierarchy that is even more oppressive than the one they replaced. Orwell\'s use of simple language and vivid characters makes the novel\'s complex political themes accessible and enduringly powerful. Animal Farm is a timeless warning about the corrupting nature of power and the ease with which revolutionary ideals can be betrayed.',
    audience: 'Readers who enjoy political satire, allegorical tales, and historical social commentary.',
    ageRating: 'All Ages (12+)',
    coverUrl: 'https://picsum.photos/seed/animal/400/600'
  },
  {
    title: 'Norwegian Wood',
    author: 'Haruki Murakami',
    genre: 'Literary Fiction',
    summary: 'A nostalgic story of loss and burgeoning sexuality in 1960s Tokyo.',
    fullOverview: 'Norwegian Wood is a melancholic and atmospheric novel that captured the hearts of a generation in Japan and beyond. Set in Tokyo during the late 1960s, the story is narrated by Toru Watanabe, who looks back on his university days and his complicated relationships with two very different women: the beautiful but emotionally fragile Naoko, and the vibrant and independent Midori. The novel is a deep exploration of grief, loss, and the search for connection in a world that often feels isolating. Murakami\'s prose is simple yet evocative, capturing the sights, sounds, and emotions of a specific time and place. Norwegian Wood is a poignant coming-of-age story that resonates with anyone who has ever experienced the bittersweet pangs of first love and the enduring weight of the past.',
    audience: 'Readers who appreciate melancholic, atmospheric prose and deep character studies.',
    ageRating: 'Adult (17+)',
    coverUrl: 'https://picsum.photos/seed/wood/400/600'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Classic',
    summary: 'A witty and timeless story of manners, marriage, and the landed gentry in Regency England.',
    fullOverview: 'Pride and Prejudice is one of the most beloved novels in the English language, celebrated for its sharp wit, memorable characters, and insightful social commentary. The story centers on the spirited Elizabeth Bennet and her complicated relationship with the wealthy and seemingly arrogant Mr. Darcy. Set against the backdrop of the British Regency, the novel explores themes of manners, upbringing, morality, and the societal pressures surrounding marriage. Elizabeth\'s journey of self-discovery, as she learns to overcome her initial prejudices and recognize Darcy\'s true character, is both humorous and deeply moving. Austen\'s masterful use of irony and her keen observations of human nature have made Pride and Prejudice a timeless classic that continues to enchant readers today.',
    audience: 'Fans of classic literature, witty social commentary, and timeless romance.',
    ageRating: 'All Ages',
    coverUrl: 'https://picsum.photos/seed/pride/400/600'
  },
  {
    title: 'The Shining',
    author: 'Stephen King',
    genre: 'Horror',
    summary: 'A family is trapped in a haunted hotel during a snowstorm, as the father slowly descends into madness.',
    fullOverview: 'The Shining is a masterpiece of modern horror that explores the themes of isolation, alcoholism, and the fragility of the human mind. The story follows Jack Torrance, a struggling writer and recovering alcoholic, who accepts a job as the off-season caretaker of the historic Overlook Hotel in the Colorado Rockies. As winter sets in and the hotel becomes isolated by snow, Jack\'s young son, Danny, who possesses a psychic ability known as "the shining," begins to experience terrifying visions of the hotel\'s dark past. The hotel\'s malevolent forces gradually take hold of Jack, driving him toward a violent and tragic confrontation with his family. King\'s ability to build suspense and create a truly unsettling atmosphere has made The Shining one of the most iconic horror novels of all time.',
    audience: 'Horror enthusiasts and readers who enjoy psychological suspense and supernatural thrillers.',
    ageRating: 'Adult (17+)',
    coverUrl: 'https://picsum.photos/seed/shining/400/600'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic',
    summary: 'A tragic story of obsession, wealth, and the American Dream in the Roaring Twenties.',
    fullOverview: 'The Great Gatsby is a quintessential American novel that captures the glamour, excess, and ultimate disillusionment of the Jazz Age. Narrated by Nick Carraway, the story follows the mysteriously wealthy Jay Gatsby and his obsessive pursuit of the beautiful Daisy Buchanan. Set on Long Island in the summer of 1922, the novel explores themes of social class, the corruption of the American Dream, and the enduring power of the past. Gatsby\'s tragic quest for a love that is ultimately unattainable serves as a powerful critique of the superficiality and moral decay of the era. Fitzgerald\'s lyrical prose and his vivid depiction of a specific moment in American history have made The Great Gatsby a cornerstone of modern literature.',
    audience: 'Readers who enjoy stories about the American Dream, social class, and tragic romance.',
    ageRating: 'Adult (15+)',
    coverUrl: 'https://picsum.photos/seed/gatsby/400/600'
  },
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    summary: 'A young boy discovers he is a wizard and begins his education at Hogwarts School of Witchcraft and Wizardry.',
    fullOverview: 'Harry Potter and the Sorcerer\'s Stone is the book that launched a global phenomenon, introducing readers to the magical world of Harry Potter. The story follows an eleven-year-old orphan who discovers on his birthday that he is a wizard and has been invited to attend Hogwarts School of Witchcraft and Wizardry. Along with his new friends Ron Weasley and Hermione Granger, Harry embarks on a journey of discovery, learning about magic, friendship, and the dark forces that threaten his world. The novel is a masterclass in world-building, filled with imaginative details, memorable characters, and a compelling mystery. Rowling\'s ability to blend elements of fantasy, adventure, and coming-of-age has made the Harry Potter series a beloved classic for readers of all ages.',
    audience: 'Fans of magic, adventure, and coming-of-age stories in a fantastical setting.',
    ageRating: 'All Ages (8+)',
    coverUrl: 'https://picsum.photos/seed/potter/400/600'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Adventure',
    summary: 'A shepherd boy named Santiago travels in search of a treasure buried near the Pyramids.',
    fullOverview: 'The Alchemist is an inspirational and allegorical novel that has touched the lives of millions of readers worldwide. The story follows Santiago, a young Andalusian shepherd boy who dreams of finding a treasure buried near the Egyptian pyramids. His journey takes him across the desert, where he encounters various characters who teach him valuable lessons about following his "Personal Legend" and listening to his heart. The novel is a powerful exploration of themes such as destiny, faith, and the importance of pursuing one\'s dreams despite the obstacles. Coelho\'s simple yet profound prose makes the book\'s philosophical messages accessible and deeply resonant. The Alchemist is a timeless story about the transformative power of self-discovery and the courage to follow one\'s own path.',
    audience: 'Readers looking for inspirational, philosophical, and allegorical stories about following one\'s dreams.',
    ageRating: 'All Ages',
    coverUrl: 'https://picsum.photos/seed/alchemist/400/600'
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic',
    summary: 'A powerful story of racial injustice and moral growth in the Depression-era South.',
    fullOverview: 'To Kill a Mockingbird is a cornerstone of American literature, a deeply moving and thought-provoking novel that explores the themes of racial injustice, moral courage, and the loss of innocence. Narrated by young Scout Finch, the story follows her father, Atticus Finch, a principled lawyer who defends a black man, Tom Robinson, falsely accused of raping a white woman in the small town of Maycomb, Alabama. Through Scout\'s eyes, we witness the deep-seated prejudices of the community and the quiet heroism of her father. The novel is a powerful indictment of racism and a celebration of the importance of empathy and standing up for what is right. Lee\'s vivid characters and her evocative depiction of the South have made To Kill a Mockingbird a timeless classic that continues to resonate with readers today.',
    audience: 'Readers interested in social justice, moral growth, and classic American literature.',
    ageRating: 'All Ages (12+)',
    coverUrl: 'https://picsum.photos/seed/mockingbird/400/600'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Literary Fiction',
    summary: 'A teenager wanders through New York City, grappling with angst, alienation, and the "phoniness" of the adult world.',
    fullOverview: 'The Catcher in the Rye is a seminal work of modern literature that captures the voice of a generation. Narrated by Holden Caulfield, a cynical and disillusioned teenager who has been expelled from his prep school, the novel follows his aimless wanderings through New York City over the course of a few days. Holden\'s internal monologue is a raw and honest exploration of teenage angst, alienation, and the perceived "phoniness" of the adult world. His search for authenticity and his desire to protect the innocence of children (the "catcher in the rye") make him one of the most iconic characters in literature. Salinger\'s use of colloquial language and his keen understanding of the adolescent psyche have made the novel a cornerstone of coming-of-age fiction.',
    audience: 'Readers who relate to themes of teenage angst, alienation, and the search for authenticity.',
    ageRating: 'YA (15+)',
    coverUrl: 'https://picsum.photos/seed/catcher/400/600'
  },
  {
    title: 'Reminders of Him',
    author: 'Colleen Hoover',
    genre: 'Romance',
    summary: 'A troubled young mother seeks redemption and a chance to reconnect with her daughter after serving time in prison.',
    fullOverview: 'Reminders of Him is a heart-wrenching and ultimately hopeful novel that explores the themes of grief, forgiveness, and the power of second chances. The story follows Kenna Rowan, a young woman who returns to her hometown after serving five years in prison for a tragic mistake that claimed the life of her boyfriend. Her only goal is to reconnect with her young daughter, whom she has never met. However, she finds herself met with hostility and judgment from everyone in her past, except for Ledger Ward, a local bar owner who has his own connection to Kenna\'s story. As Kenna and Ledger develop an unlikely bond, they must navigate the complexities of their shared past and the difficult path toward redemption. Hoover\'s ability to capture raw emotion and create deeply relatable characters makes Reminders of Him a powerful and moving read.',
    audience: 'Fans of emotional contemporary romance and stories of forgiveness and second chances.',
    ageRating: 'Adult (18+)',
    coverUrl: 'https://picsum.photos/seed/reminders/400/600'
  },
  {
    title: 'The Murder of Roger Ackroyd',
    author: 'Agatha Christie',
    genre: 'Mystery',
    summary: 'Hercule Poirot investigates the murder of a wealthy widower in a small English village.',
    fullOverview: 'The Murder of Roger Ackroyd is one of Agatha Christie\'s most famous and controversial novels, celebrated for its ingenious plot and its shocking twist ending. The story is narrated by Dr. James Sheppard, a local physician who assists the retired Belgian detective Hercule Poirot in investigating the murder of his friend, Roger Ackroyd. Set in the quiet English village of King\'s Abbot, the novel is a classic "whodunit," filled with a cast of suspicious characters, hidden motives, and clever clues. Christie\'s masterful use of misdirection and her ability to subvert the conventions of the mystery genre have made this book a cornerstone of detective fiction. It is a must-read for any fan of the genre and a testament to Christie\'s brilliance as a storyteller.',
    audience: 'Fans of classic detective fiction, clever mysteries, and surprising plot twists.',
    ageRating: 'All Ages (12+)',
    coverUrl: 'https://picsum.photos/seed/ackroyd/400/600'
  },
  {
    title: 'The Old Man and the Sea',
    author: 'Ernest Hemingway',
    genre: 'Literary Fiction',
    summary: 'An aging fisherman\'s epic struggle with a giant marlin in the Gulf Stream.',
    fullOverview: 'The Old Man and the Sea is a short but powerful novel that earned Ernest Hemingway the Pulitzer Prize and contributed to his Nobel Prize in Literature. The story follows Santiago, an aging Cuban fisherman who has gone eighty-four days without catching a fish. Determined to break his streak, he sails far out into the Gulf Stream, where he hooks a massive marlin. The novel is a detailed and visceral account of Santiago\'s epic three-day struggle with the fish, exploring themes of endurance, dignity, and the relationship between man and nature. Hemingway\'s sparse and direct prose perfectly captures the harsh beauty of the sea and the quiet strength of his protagonist. The Old Man and the Sea is a timeless masterpiece that celebrates the human spirit\'s ability to endure in the face of overwhelming odds.',
    audience: 'Readers who appreciate sparse, powerful prose and stories of human endurance and dignity.',
    ageRating: 'All Ages',
    coverUrl: 'https://picsum.photos/seed/oldman/400/600'
  },
  {
    title: 'The Book Thief',
    author: 'Markus Zusak',
    genre: 'Historical Fiction',
    summary: 'A young girl in Nazi Germany finds solace in books and shares them with others, narrated by Death.',
    fullOverview: 'The Book Thief is a unique and deeply moving novel set in Nazi Germany during World War II. Narrated by Death, the story follows Liesel Meminger, a young girl who is sent to live with foster parents in a small town near Munich. As the horrors of the war unfold around her, Liesel finds solace in stealing books and sharing them with her foster father, her neighbors, and the Jewish man hiding in her basement. The novel is a powerful exploration of the beauty and cruelty of humanity, the power of words to both destroy and heal, and the enduring strength of the human spirit. Zusak\'s poetic prose and his innovative narrative perspective make The Book Thief a truly unforgettable read that resonates with readers of all ages.',
    audience: 'Readers who enjoy historical fiction, unique narrative voices, and stories about the power of literature and human connection.',
    ageRating: 'YA (12+)',
    coverUrl: 'https://picsum.photos/seed/bookthief/400/600'
  },
  {
    title: 'Kafka on the Shore',
    author: 'Haruki Murakami',
    genre: 'Magical Realism',
    summary: 'The parallel stories of a teenage runaway and an elderly man who can talk to cats.',
    fullOverview: 'Kafka on the Shore is a surreal and captivating novel that blends elements of magical realism, mystery, and philosophical exploration. The story follows two parallel narratives: that of Kafka Tamura, a fifteen-year-old boy who runs away from home to escape an oedipal curse, and Nakata, an elderly man who suffered a mysterious childhood accident that left him with limited mental capacity but the ability to communicate with cats. As their paths eventually converge in a small town in Shikoku, the novel delves into themes of identity, memory, the power of the subconscious, and the blurred lines between reality and dreams. Murakami\'s imaginative world-building and his ability to weave together disparate threads into a cohesive and thought-provoking whole make Kafka on the Shore a truly unique and unforgettable reading experience.',
    audience: 'Fans of magical realism, surrealism, and complex, multi-layered narratives.',
    ageRating: 'Adult (17+)',
    coverUrl: 'https://picsum.photos/seed/kafka/400/600'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    summary: 'The adventures of Bilbo Baggins as he joins a quest to reclaim a stolen treasure from a dragon.',
    fullOverview: 'The Hobbit is a classic of fantasy literature that serves as a prelude to Tolkien\'s epic masterpiece, The Lord of the Rings. The story follows Bilbo Baggins, a home-loving hobbit who is swept away on an unexpected adventure by the wizard Gandalf and a company of thirteen dwarves. Their quest is to reclaim the lost Dwarf Kingdom of Erebor and its vast treasure from the fearsome dragon Smaug. Along the way, Bilbo encounters trolls, goblins, giant spiders, and the mysterious creature Gollum, from whom he acquires a magical ring. The novel is a delightful blend of adventure, humor, and wonder, filled with rich world-building and memorable characters. Tolkien\'s masterful storytelling and his creation of a fully realized secondary world have made The Hobbit a beloved classic for generations of readers.',
    audience: 'Fans of high fantasy, epic adventures, and classic storytelling.',
    ageRating: 'All Ages (8+)',
    coverUrl: 'https://picsum.photos/seed/hobbit/400/600'
  }
];

async function populate() {
  console.log('Starting book population...');
  
  // Clear existing books first to ensure fresh data with fullOverview
  const existingSnapshot = await getDocs(collection(db, 'books'));
  const batch = writeBatch(db);
  existingSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log('Cleared existing books.');

  for (const book of BOOKS) {
    try {
      await addDoc(collection(db, 'books'), book);
      console.log(`Added: ${book.title}`);
    } catch (error) {
      console.error(`Error adding ${book.title}:`, error);
    }
  }
  
  console.log('Population complete!');
  process.exit(0);
}

populate();
