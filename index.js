//imports
const express = require("express");
const app = express();
const redis = require("redis");
const basicAuth = require("express-basic-auth");
const { promisify } = require("util");

//instancias
app.use(express.json());
const client = redis.createClient({ port: 6379 });
var version = 1;

const get_async = promisify(client.get).bind(client);
const set_async = promisify(client.setex).bind(client);
const del_async = promisify(client.del).bind(client);

var resumes = [
  {
    basics: {
      name: "John Doe",
      label: "Programmer",
      picture: "",
      email: "john@gmail.com",
      phone: "(912) 555-4321",
      website: "http://johndoe.com",
      summary: "A summary of John Doe...",
      location: {
        address: "2712 Broadway St",
        postalCode: "CA 94115",
        city: "San Francisco",
        countryCode: "US",
        region: "California",
      },
      profiles: [
        {
          network: "Twitter",
          username: "john",
          url: "http://twitter.com/john",
        },
      ],
    },
    work: [
      {
        company: "Company",
        position: "President",
        website: "http://company.com",
        startDate: "2013-01-01",
        endDate: "2014-01-01",
        summary: "Description...",
        highlights: ["Started the company"],
      },
    ],
    volunteer: [
      {
        organization: "Organization",
        position: "Volunteer",
        website: "http://organization.com/",
        startDate: "2012-01-01",
        endDate: "2013-01-01",
        summary: "Description...",
        highlights: ["Awarded 'Volunteer of the Month'"],
      },
    ],
    education: [
      {
        institution: "University",
        area: "Software Development",
        studyType: "Bachelor",
        startDate: "2011-01-01",
        endDate: "2013-01-01",
        gpa: "4.0",
        courses: ["DB1101 - Basic SQL"],
      },
    ],
    awards: [
      {
        title: "Award",
        date: "2014-11-01",
        awarder: "Company",
        summary: "There is no spoon.",
      },
    ],
    publications: [
      {
        name: "Publication",
        publisher: "Company",
        releaseDate: "2014-10-01",
        website: "http://publication.com",
        summary: "Description...",
      },
    ],
    skills: [
      {
        name: "Web Development",
        level: "Master",
        keywords: ["HTML", "CSS", "Javascript"],
      },
    ],
    languages: [
      {
        language: "English",
        fluency: "Native speaker",
      },
    ],
    interests: [
      {
        name: "Wildlife",
        keywords: ["Ferrets", "Unicorns"],
      },
    ],
    references: [
      {
        name: "Jane Doe",
        reference: "Reference...",
      },
    ],
  },
  {
    basics: {
      name: "Alberto",
      label: "Programmer",
      picture: "",
      email: "albertoosorio99@gmail.com",
      phone: "(912) 555-4321",
      website: "http://johndoe.com",
      summary: "A summary of John Doe...",
      location: {
        address: "2712 Broadway St",
        postalCode: "CA 94115",
        city: "San Francisco",
        countryCode: "US",
        region: "California",
      },
      profiles: [
        {
          network: "facebook",
          username: "john",
          url: "http://twitter.com/john",
        },
      ],
    },
    work: [
      {
        company: "INTEC",
        position: "President",
        website: "http://company.com",
        startDate: "2013-01-01",
        endDate: "2014-01-01",
        summary: "Description...",
        highlights: ["Started the company"],
      },
    ],
    volunteer: [
      {
        organization: "Organization",
        position: "President",
        website: "http://organization.com/",
        startDate: "2012-01-01",
        endDate: "2013-01-01",
        summary: "Description...",
        highlights: ["Awarded 'Volunteer of the Month'"],
      },
    ],
    education: [
      {
        institution: "School",
        area: "Software Development",
        studyType: "Bachelor",
        startDate: "2011-01-01",
        endDate: "2013-01-01",
        gpa: "4.0",
        courses: ["DB1101 - Basic SQL"],
      },
    ],
    awards: [
      {
        title: "Best Award",
        date: "2014-11-01",
        awarder: "Company",
        summary: "There is no spoon.",
      },
    ],
    publications: [
      {
        name: " Name",
        publisher: "Company",
        releaseDate: "2014-10-01",
        website: "http://publication.com",
        summary: "Description...",
      },
    ],
    skills: [
      {
        name: "Web Development master",
        level: "Master",
        keywords: ["HTML", "CSS", "Javascript"],
      },
    ],
    languages: [
      {
        language: "Spanish",
        fluency: "Native speaker",
      },
    ],
    interests: [
      {
        name: "Wildlife",
        keywords: ["Anime", "Unicorns"],
      },
    ],
    references: [
      {
        name: "Jose Salazar",
        reference: "Reference...",
      },
    ],
  },
];

//#region GET

app.get("/resume", async (req, res) => {
  res.set("etag", `${version}`);
  const cache = await get_async(`Version ${version}`);
  if (!cache) {
    const save = await set_async(
      `Version ${version}`,
      3600,
      JSON.stringify(resumes)
    );
    console.log("Saving data...");
    res.status(200).send(resumes);
  } else {
    res.status(200).send(JSON.parse(cache));
  }
});

app.get("/resume/:name", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);
  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item)
      );
      console.log("Saving data...");
      res.status(200).send(item);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/profiles", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.basics.profiles)
      );
      console.log("Saving data...");
      res.status(200).send(item.basics.profiles);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.basics.profiles);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/work", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);
  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.work)
      );
      console.log("Saving data...");
      res.status(200).send(item.work);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.work);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/work/highlights", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.work.highlights)
      );
      console.log("Saving data...");
      res.status(200).send(item.work.highlights);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.work.highlights);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/volunteer", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.volunteer)
      );
      console.log("Saving data...");
      res.status(200).send(item.volunteer);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.volunteer);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/volunteer/highlights", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.volunteer.highlights)
      );
      console.log("Saving data...");
      res.status(200).send(item.volunteer.highlights);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.volunteer.highlights);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/education", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);
  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.education)
      );
      console.log("Saving data...");
      res.status(200).send(item.education);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.education);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/education/courses", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.education.courses)
      );
      console.log("Saving data...");
      res.status(200).send(item.education.courses);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.education.courses);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/awards", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.awards)
      );
      console.log("Saving data...");
      res.status(200).send(item.awards);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.awards);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/publications", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.publications)
      );
      console.log("Saving data...");
      res.status(200).send(item.publications);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.publications);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/skills", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.skills)
      );
      console.log("Saving data...");
      res.status(200).send(item.skills);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.skills);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/skills/keywords", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.skills.keywords)
      );
      console.log("Saving data...");
      res.status(200).send(item.skills.keywords);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.skills.keywords);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/languages", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.languages)
      );
      console.log("Saving data...");
      res.status(200).send(item.languages);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.languages);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/interests", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.interests)
      );
      console.log("Saving data...");
      res.status(200).send(item.interests);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.interests);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/interests/keywords", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.interests.keywords)
      );
      console.log("Saving data...");
      res.status(200).send(item.interests.keywords);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.interests.keywords);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

app.get("/resume/:name/references", async (req, res) => {
  const item = resumes.find((c) => c.basics.name === req.params.name);

  if (item) {
    res.set("etag", `${version}`);
    const cache = await get_async(`Version ${version}`);
    if (!cache) {
      const save = await set_async(
        `Version ${version}`,
        3600,
        JSON.stringify(item.references)
      );
      console.log("Saving data...");
      res.status(200).send(item.references);
    } else {
      const reply = JSON.parse(cache);
      const response = reply.find((c) => c.basics.name === req.params.name);
      res.status(200).send(response.references);
    }
  } else {
    res.status(404).send("Tis item does not exist...");
  }
});

//#endregion

//#region POST

app.post(
  "/resume/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      resumes.push(req.body);
      version++;
      res.status(200).send("Success!");
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

//#endregion

//#region PUT

app.put(
  "/resume/:name/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        resumes[index] = req.body;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

//#endregion

//#region PATCH

app.patch(
  "/resume/:name/basics/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.basics[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/basics/location/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.basics.location[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/work/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.work[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/volunteer/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.volunteer[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/education/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.education[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/awards/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.basics[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/publications/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.publications[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/skills/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.skills[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/languages/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.languages[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/interests/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.interests[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

app.patch(
  "/resume/:name/references/:version",
  basicAuth({ users: { admin: "1234" } }),
  (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        const BodyKey = Object.keys(req.body)[0];
        const newValue = Object.values(req.body)[0];

        item.references[BodyKey] = newValue;
        resumes[index] = item;
        version++;
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

//#endregion

//#region DELETE

app.delete(
  "/resume/:name/:version",
  basicAuth({ users: { admin: "1234" } }),
  async (req, res) => {
    const item = resumes.find((c) => c.basics.name === req.params.name);
    const index = resumes.indexOf(item);

    res.set("etag", `${version}`);
    if (res.get("etag") === `${req.params.version}`) {
      if (item) {
        resumes.splice(index, 1);
        await del_async(`Version ${version}`);
        res.status(200).send("Success!");
      } else {
        res.status(404).send("This item could not been found");
      }
    } else {
      res.status(409).send("This is not the last version");
    }
  }
);

//#endregion

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
