export const removeEmpty_Tests = ({
  removeEmpty,
}: {
  removeEmpty: Function;
}) => {
  const user = {
    bio: { twitter: { displayName: "jamezz", link: "/facebook/jamezz" } },
    bio1: { twitter: { displayName: "jamezz", link: undefined } },
    bio2: { twitter: {} },
    dob: "02/02/1895",
    joinDate: "today",
    name: "James",
    password: "1234",
  };

  describe("removeEmpty", () => {
    it("should only remove empty values", () => {
      expect(removeEmpty({ ...user }, "bio.twitter.link")).toEqual(user);

      expect(removeEmpty({ ...user }, "bio1.twitter.link")).toEqual({
        ...user,
        bio1: { twitter: { displayName: user.bio1.twitter.displayName } },
      });

      expect(removeEmpty({ ...user }, "bio2.twitter.link")).toEqual(
        (() => {
          const { bio2, ...rest } = user;

          return rest;
        })()
      );
    });
  });
};
