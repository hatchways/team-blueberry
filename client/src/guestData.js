const usersData = {
  guest: {
    id: "guest",
    name: "Guest",
    balance: 3,
    languages: [
      {
        language: "Python",
        level: 2,
      },
      {
        language: "JavaScript",
        level: 1,
      },
    ],
    projects: [
      {
        link: "https://www.google.com",
        title: "Guest Project",
        _id: "guestproject",
      },
    ],
    rating: 4.5,
    email: "guest@guest.guest",
    position: "Full Stack Developer",
    company: "Google",
  },
  demo: {
    id: "demo",
    name: "Demo",
    balance: 3,
    languages: [
      {
        language: "Python",
        level: 1,
      },
      {
        language: "JavaScript",
        level: 2,
      },
    ],
    projects: [],
    rating: 4,
    email: "demo@demo.demo",
    position: "Frontend Engineer",
    company: "Netflix",
  },
};

const guestRequest = {
  _id: "guestrequest",
  reviewersDeclined: [],
  status: "accepted",
  userOwner: "guest",
  userLanguageLevel: 1,
  embeddedReview: {
    rating: 1,
    _id: "guestreview",
    title: "Guest Review for Demo",
    language: "JavaScript",
    userId: "guest",
    messages: [
      {
        _id: "guestmessage",
        message: JSON.stringify({
          entityMap: {},
          blocks: [
            { type: "header-one", text: "Guest Review" },
            {
              type: "unstyled",
              text: "Type a message or complete this review",
            },
            { type: "code-block", text: "const x = [1, 2, 3]" },
          ],
        }),
        messagePostedBy: "guest",
        messagePostDate: "2020-08-25T15:13:35.425Z",
      },
      {
        _id: "demoguestmessage",
        message: JSON.stringify({
          blocks: [
            {
              key: "1e1sn",
              text: "Click on my header to go to my profile",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: { syntax: "javascript" },
            },
          ],
          entityMap: {},
        }),
        messagePostedBy: "demo",
        messagePostDate: "2020-08-25T15:13:35.425Z",
      },
    ],
    reviewCreatedDate: "2020-08-25T15:13:35.429Z",
  },
  requestCreatedDate: "2020-08-25T15:13:35.425Z",
  selectedReviewer: "demo",
};

const demoRequest = {
  _id: "demorequest",
  reviewersDeclined: [],
  status: "pending",
  userOwner: "demo",
  userLanguageLevel: 1,
  embeddedReview: {
    rating: 1,
    _id: "demoreview",
    title: "Demo Review for Guest",
    language: "JavaScript",
    userId: "demo",
    messages: [
      {
        _id: "demomessage",
        message: JSON.stringify({
          entityMap: {},
          blocks: [
            { type: "header-one", text: "Demo Review" },
            {
              type: "unstyled",
              text:
                "Accept will let you send messages on this thread. Decline will take away access to sending messages.",
            },
            { type: "code-block", text: 'console.log("Hello World");' },
          ],
        }),
        messagePostedBy: "guest",
        messagePostDate: "2020-08-25T15:13:35.425Z",
      },
    ],
    reviewCreatedDate: "2020-08-25T15:13:35.429Z",
  },
  requestCreatedDate: "2020-08-25T15:13:35.425Z",
  selectedReviewer: "guest",
};

const guestNotifications = [
  {
    author: "Demo",
    createdAt: "2020-08-25T15:13:35.425Z",
    recipient: "guest",
    seen: true,
    text: 'Demo asks you to review "Demo Review for Guest"',
    thread: "demoreview",
    _id: "guestnotification",
  },
];

const guestComments = [
  {
    comment: "Great review! Hope to hear back from you!",
    name: "Demo",
    position: "Frontend Engineer",
    company: "Netflix",
    userOwner: "demo",
    embeddedReview: {
      rating: 4,
    },
  },
  {
    comment: "You are awesome! Let's connect!",
    name: "Demo1",
    position: "Full Stack Engineer",
    company: "Google",
    userOwner: "demo1",
    embeddedReview: {
      rating: 5,
    },
  },
  {
    comment:
      "This review could better. Looking for more in-depth explanation for this topic.",
    name: "Demo2",
    position: "Senior Software Engineer",
    company: "Facebook",
    userOwner: "demo2",
    embeddedReview: {
      rating: 3,
    },
  },
  {
    comment: "Can't get any better!",
    name: "Demo3",
    position: "Junior Developer",
    company: "UpWork",
    userOwner: "demo3",
    embeddedReview: {
      rating: 5,
    },
  },
];

const demoComments = [
  {
    comment:
      "This review could better. Looking for more in-depth explanation for this topic.",
    name: "Demo2",
    position: "Senior Software Engineer",
    company: "Facebook",
    userOwner: "demo2",
    embeddedReview: {
      rating: 3,
    },
  },
  {
    comment: "Can't get any better!",
    name: "Demo3",
    position: "Junior Developer",
    company: "UpWork",
    userOwner: "demo3",
    embeddedReview: {
      rating: 5,
    },
  },
];

export {
  usersData,
  guestRequest,
  demoRequest,
  guestNotifications,
  guestComments,
  demoComments,
};
