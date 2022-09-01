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
        name: "James",
        password: "1234",
        joinDate: "today",
        dob: "02/02/1895",
        bio: { twitter: { displayName: "jamezz", link: "/facebook/jamezz" } },
      },
      {
        name: "Mary",
        password: "1234",
        joinDate: "today",
        dob: "02/07/1905",
        bio: {
          twitter: { displayName: "mary_jane", link: "/facebook/mary_jane" },
        },
      },
      {
        name: "Bob",
        password: "1234",
        joinDate: "today",
        dob: "02/02/1900",
        bio: { twitter: { displayName: "bobby", link: "/facebook/bobby" } },
      },
    ];
  });

  describe("sanitize", () => {
    it("should return same value if it is not an object or empty array", () => {
      const values = [null, undefined, false, true, "hey", []];

      for (const value of values) expect(sanitize(value)).toEqual(value);
    });

    it("should remove specified fields", () => {
      const getUser = (user: User) => ({
        name: user.name,
        dob: user.dob,
        joinDate: user.joinDate,
        bio: user.bio,
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
        name: user.name,
        dob: user.dob,
        joinDate: user.joinDate,
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
        name: user.name,
        dob: user.dob,
        joinDate: user.joinDate,
        bio: { twitter: { displayName: user.bio.twitter.displayName } },
      });

      const user = users[0];
      const sanitizedUser = getUser(user);

      const sanitizedUsers = users.map((user) => getUser(user));

      const option = { remove: ["bio.twitter.link", "password"] };

      expect(sanitize(user, option)).toEqual(sanitizedUser);

      expect(sanitize(users, option)).toEqual(sanitizedUsers);
    });
  });
};
