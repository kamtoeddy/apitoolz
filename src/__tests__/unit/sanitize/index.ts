type User = {
  name: string;
  password: string;
  joinDate: string;
  dob: string;
  bio: { twitter: { displayName: string; link: string } };
};

export const sanitize_Tests = ({ sanitize }: { sanitize: Function }) => {
  let users: User[];

  beforeEach(() => {
    users = [
      {
        bio: { twitter: { displayName: "jamezz", link: "/facebook/jamezz" } },
        dob: "02/02/1895",
        joinDate: "today",
        name: "James",
        password: "1234",
      },
      {
        bio: {
          twitter: { displayName: "mary_jane", link: "/facebook/mary_jane" },
        },
        dob: "02/07/1905",
        joinDate: "today",
        name: "Mary",
        password: "1234",
      },
      {
        bio: { twitter: { displayName: "bobby", link: "/facebook/bobby" } },
        dob: "02/02/1900",
        joinDate: "today",
        name: "Bob",
        password: "1234",
      },
    ];
  });

  describe("sanitize", () => {
    // to ignore
    it("should return same value if it is not an object or empty array", () => {
      const values = [null, undefined, false, true, "hey", []];

      for (const value of values) expect(sanitize(value)).toEqual(value);
    });

    // default options
    it("should return same value if no option is specified", () => {
      const values = [users[0], users];

      for (const value of values) expect(sanitize(value, {})).toEqual(value);
    });

    // remove
    it("should remove specified fields", () => {
      const getUser = (user: User) => ({
        bio: user.bio,
        dob: user.dob,
        joinDate: user.joinDate,
        name: user.name,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const options = [{ remove: "password" }, { remove: ["password"] }];

      for (const option of options)
        expect(sanitize(user, option)).toEqual(sanitizedUser);

      for (const option of options)
        expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    it("should remove multiple fields", () => {
      const getUser = (user: User) => ({
        dob: user.dob,
        joinDate: user.joinDate,
        name: user.name,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = { remove: ["bio", "password"] };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    it("should remove nested fields", () => {
      const getUser = (user: User) => ({
        bio: { twitter: { displayName: user.bio.twitter.displayName } },
        dob: user.dob,
        joinDate: user.joinDate,
        name: user.name,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = { remove: ["bio.twitter.link", "password"] };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    // replace
    it("should replace specified fields", () => {
      const getUser = (user: User) => ({
        bio: user.bio,
        dateJoined: user.joinDate,
        dob: user.dob,
        name: user.name,
        password: user.password,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = { replace: { joinDate: "dateJoined" } };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    it("should replace multiple fields", () => {
      const getUser = (user: User) => ({
        bio: user.bio,
        dateOfBirth: user.dob,
        dateJoined: user.joinDate,
        name: user.name,
        password: user.password,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = {
        replace: { joinDate: "dateJoined", dob: "dateOfBirth" },
      };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    it("should replace nested fields", () => {
      const getUser = (user: User) => ({
        bio: { twitter: { displayName: user.bio.twitter.displayName } },
        dateOfBirth: user.dob,
        joinDate: user.joinDate,
        name: user.name,
        password: user.password,
        twitterLink: user.bio.twitter.link,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = {
        replace: { "bio.twitter.link": "twitterLink", dob: "dateOfBirth" },
      };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    // remove & replace
    it("should remove & replace fields", () => {
      const getUser = (user: User) => ({
        bio: { twitter: { displayName: user.bio.twitter.displayName } },
        dateOfBirth: user.dob,
        joinDate: user.joinDate,
        name: user.name,
        twitterLink: user.bio.twitter.link,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = {
        remove: "password",
        replace: { "bio.twitter.link": "twitterLink", dob: "dateOfBirth" },
      };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    // select
    it("should select specified fields", () => {
      const getUser = (user: User) => ({ name: user.name });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = { select: "name" };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    it("should select multiple fields", () => {
      const getUser = (user: User) => ({
        bio: user.bio,
        dob: user.dob,
        name: user.name,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = { select: ["bio", "dob", "name"] };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    it("should select nested fields", () => {
      const getUser = (user: User) => ({
        bio: { twitter: { link: user.bio.twitter.link } },
        dob: user.dob,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = { select: ["bio.twitter.link", "dob"] };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });

    // select & replace
    it("should select & replace fields", () => {
      const getUser = (user: User) => ({
        dob: user.dob,
        twitterLink: user.bio.twitter.link,
        twitterName: user.bio.twitter.displayName,
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = {
        select: ["bio.twitter", "dob"],
        replace: {
          "bio.twitter.link": "twitterLink",
          "bio.twitter.displayName": "twitterName",
        },
      };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });
  });
};
