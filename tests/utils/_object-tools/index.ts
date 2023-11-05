import { beforeEach, describe, expect, it } from 'vitest';

export const assignDeep_Tests = ({ assignDeep }: { assignDeep: Function }) => {
  describe('assignDeep', () => {
    it('should do nothing with empty key', () => {
      const values = [{}, { age: 17 }];

      for (const value of values)
        expect(assignDeep(value, '', 'James')).toEqual(value);
    });

    it('should assign a value to a simple key', () => {
      expect(assignDeep({}, 'name', 'James')).toEqual({
        name: 'James'
      });

      expect(assignDeep({ age: 17, name: 'Paul' }, 'name', 'James')).toEqual({
        age: 17,
        name: 'James'
      });
    });

    it('should assign a value to a nested key', () => {
      let dt = assignDeep({}, 'bio.facebook.displayName', 'james-1');
      assignDeep(dt, 'bio.facebook.followers', '12.7k');

      expect(dt).toEqual({
        bio: { facebook: { displayName: 'james-1', followers: '12.7k' } }
      });

      let dt2 = assignDeep(
        { name: 'James' },
        'bio.facebook.displayName',
        'james-1'
      );
      assignDeep(dt2, 'bio.facebook.followers', '13.7k');

      expect(dt2).toEqual({
        name: 'James',
        bio: { facebook: { displayName: 'james-1', followers: '13.7k' } }
      });
    });
  });
};

export const getDeepValue_Tests = ({
  getDeepValue
}: {
  getDeepValue: Function;
}) => {
  describe('getDeepValue', () => {
    let person = {
      name: 'James',
      age: 20,
      bio: {
        joinDate: 'today',
        facebook: { link: '/facebook/james', likes: 1700 }
      }
    };

    it('should give value with simple keys', () => {
      const truthy: [string, any][] = [
        ['name', 'James'],
        ['age', 20]
      ];

      for (const [key, value] of truthy) {
        expect(getDeepValue(person, key)).toBe(value);
      }
    });

    it('should give value with nested keys', () => {
      const truthy: [string, any][] = [
        ['bio.joinDate', 'today'],
        ['bio.facebook.link', '/facebook/james'],
        ['bio.facebook.likes', 1700]
      ];

      for (const [key, value] of truthy) {
        expect(getDeepValue(person, key)).toBe(value);
      }
    });

    it('should give undefined if simple key is not set', () => {
      expect(getDeepValue(person, 'dob')).toBe(undefined);
    });

    it('should give undefined if nested key is not set', () => {
      expect(getDeepValue(person, 'address.streetName')).toBe(undefined);
    });
  });
};

export const hasDeepKey_Tests = ({ hasDeepKey }: { hasDeepKey: Function }) => {
  describe('hasDeepKey', () => {
    const user = {
      name: 'James',
      bio: {
        facebook: { displayName: 'james-1' },
        twitter: { followers: '25k' }
      }
    };

    it('should tell if an object has simple key', () => {
      expect(hasDeepKey(user, 'name')).toBe(true);
      expect(hasDeepKey(user, 'age')).toBe(false);
    });

    it('should tell if an object has nested key', () => {
      const values = [
        ['address.street.name', false],
        ['address.street', false],
        ['bio.facebook', true],
        ['bio.facebook.displayName', true],
        ['bio.twitter.followers', true],
        ['bio.twitter.displayName', false]
      ];

      for (const [key, value] of values)
        expect(hasDeepKey(user, key)).toBe(value);
    });
  });
};

export const isEqual_Tests = ({ isEqual }: { isEqual: Function }) => {
  describe('isEqual', () => {
    it('should return true if a and b are equal else false', () => {
      // truthy
      const now = new Date();
      expect(isEqual(now, now)).toBe(true);
      expect(isEqual(1, 1)).toBe(true);
      expect(isEqual({}, {})).toBe(true);
      expect(isEqual([], [])).toBe(true);
      expect(isEqual(undefined, undefined)).toBe(true);
      expect(isEqual([1, 'true', [], null], [1, 'true', [], null])).toBe(true);
      expect(isEqual({ a: 'James' }, { a: 'James' })).toBe(true);
      expect(isEqual({ a: '' }, { a: '' })).toBe(true);
      expect(isEqual({ a: '', b: '' }, { a: '', b: '' })).toBe(true);
      expect(isEqual({ a: '', b: '' }, { b: '', a: '' })).toBe(true);
      expect(isEqual({ a: '', b: { c: '' } }, { b: { c: '' }, a: '' })).toBe(
        true
      );

      // falsy
      expect(
        isEqual(now, new Date(new Date(now).setHours(now.getHours() + 10)))
      ).toBe(false);
      expect(isEqual(1, '1')).toBe(false);
      expect(isEqual({}, '1')).toBe(false);
      expect(isEqual([1, 'true', []], [1, 'true', '[]'])).toBe(false);
      expect(isEqual([1, 'true', [], null], [1, 'true', null, []])).toBe(false);
      expect(isEqual({ a: 'James' }, { a: 'JameS' })).toBe(false);
      expect(isEqual({ a: 'James' }, { a: 'James', b: 17 })).toBe(false);
    });

    it('should respect the level of nesting(depth)', () => {
      // depth == undefined (defaults to 1)

      for (const depth of [undefined, 1]) {
        expect(
          isEqual({ a: '', b: { c: '' } }, { b: { c: '' }, a: '' }, depth)
        ).toEqual(true);

        expect(
          isEqual({ a: '', b: [1, 2] }, { b: [1, 2], a: '' }, depth)
        ).toEqual(true);

        expect(
          isEqual(
            { a: '', b: { c: '', d: [1, 2] } },
            { b: { d: [1, 2], c: '' }, a: '' },
            depth
          )
        ).toEqual(true);

        expect(
          isEqual(
            { a: '', b: { d: '', c: '' } },
            { b: { c: '', d: '' }, a: '' },
            depth
          )
        ).toEqual(true);
      }

      // depth == 0
      expect(
        isEqual({ a: '', b: { c: '' } }, { b: { c: '' }, a: '' }, 0)
      ).toEqual(true);

      expect(isEqual({ a: '', b: [1, 2] }, { b: [1, 2], a: '' }, 0)).toEqual(
        true
      );

      expect(
        isEqual(
          { a: '', b: { c: '', d: [1, 2] } },
          { b: { d: [1, 2], c: '' }, a: '' },
          0
        )
      ).toEqual(false);

      expect(
        isEqual(
          { a: '', b: { d: '', c: '' } },
          { b: { c: '', d: '' }, a: '' },
          0
        )
      ).toEqual(false);

      for (const depth of [2, 3, Infinity]) {
        expect(
          isEqual({ a: '', b: { c: '' } }, { b: { c: '' }, a: '' }, depth)
        ).toEqual(true);

        expect(
          isEqual({ a: '', b: [1, 2] }, { b: [1, 2], a: '' }, depth)
        ).toEqual(true);

        expect(
          isEqual(
            { a: '', b: { c: '', d: [1, 2] } },
            { b: { d: [1, 2], c: '' }, a: '' },
            depth
          )
        ).toEqual(true);

        expect(
          isEqual(
            { a: '', b: { d: '', c: '' } },
            { b: { c: '', d: '' }, a: '' },
            depth
          )
        ).toEqual(true);
      }
    });
  });
};

export const removeDeep_Tests = ({ removeDeep }: { removeDeep: Function }) => {
  describe('removeDeep', () => {
    let user: any;

    beforeEach(() => {
      user = {
        name: 'James',
        bio: {
          facebook: { displayName: 'james-1' },
          twitter: { followers: '25k' }
        }
      };
    });

    it('should do nothing with empty key', () => {
      const values = [{}, { age: 17 }];

      for (const value of values) expect(removeDeep(value, '')).toEqual(value);
    });

    it('should not modify object if key is missing', () => {
      removeDeep(user, 'age');
      removeDeep(user, 'bio.instagram');
      expect(user).toMatchObject(user);
    });

    it('should remove a simple key', () => {
      removeDeep(user, 'age');
      expect(user).toMatchObject(user);
      expect(user).toMatchObject({
        bio: {
          facebook: { displayName: 'james-1' },
          twitter: { followers: '25k' }
        }
      });
    });

    it('should remove a nested key', () => {
      removeDeep(user, 'bio.facebook.displayName');
      removeDeep(user, 'bio.twitter');
      expect(user).toMatchObject({ bio: { facebook: {} } });
    });
  });
};

export const removeEmpty_Tests = ({
  removeEmpty
}: {
  removeEmpty: Function;
}) => {
  const user = {
    bio: { twitter: { displayName: 'jamezz', link: '/facebook/jamezz' } },
    bio1: { twitter: { displayName: 'jamezz', link: undefined } },
    bio2: { twitter: {} },
    dob: '02/02/1895',
    joinDate: 'today',
    name: 'James',
    password: '1234'
  };

  describe('removeEmpty', () => {
    it('should only remove empty values', () => {
      expect(removeEmpty({ ...user }, 'bio.twitter.link')).toEqual(user);

      expect(removeEmpty({ ...user }, 'bio1.twitter.link')).toEqual({
        ...user,
        bio1: { twitter: { displayName: user.bio1.twitter.displayName } }
      });

      expect(removeEmpty({ ...user }, 'bio2.twitter.link')).toEqual(
        (() => {
          const { bio2, ...rest } = user;

          return rest;
        })()
      );
    });
  });
};
