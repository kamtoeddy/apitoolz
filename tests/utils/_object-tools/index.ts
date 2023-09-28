import { beforeEach, describe, expect, it } from 'vitest'

export const assignDeep_Tests = ({ assignDeep }: { assignDeep: Function }) => {
  describe('assignDeep', () => {
    it('should do nothing with empty key', () => {
      const values = [{}, { age: 17 }]

      for (const value of values)
        expect(assignDeep(value, '', 'James')).toEqual(value)
    })

    it('should assign a value to a simple key', () => {
      expect(assignDeep({}, 'name', 'James')).toEqual({
        name: 'James'
      })

      expect(assignDeep({ age: 17, name: 'Paul' }, 'name', 'James')).toEqual({
        age: 17,
        name: 'James'
      })
    })

    it('should assign a value to a nested key', () => {
      let dt = assignDeep({}, 'bio.facebook.displayName', 'james-1')
      assignDeep(dt, 'bio.facebook.followers', '12.7k')

      expect(dt).toEqual({
        bio: { facebook: { displayName: 'james-1', followers: '12.7k' } }
      })

      let dt2 = assignDeep(
        { name: 'James' },
        'bio.facebook.displayName',
        'james-1'
      )
      assignDeep(dt2, 'bio.facebook.followers', '13.7k')

      expect(dt2).toEqual({
        name: 'James',
        bio: { facebook: { displayName: 'james-1', followers: '13.7k' } }
      })
    })
  })
}

export const getDeepValue_Tests = ({
  getDeepValue
}: {
  getDeepValue: Function
}) => {
  describe('getDeepValue', () => {
    let person = {
      name: 'James',
      age: 20,
      bio: {
        joinDate: 'today',
        facebook: { link: '/facebook/james', likes: 1700 }
      }
    }

    it('should give value with simple keys', () => {
      const truthy: [string, any][] = [
        ['name', 'James'],
        ['age', 20]
      ]

      for (const [key, value] of truthy) {
        expect(getDeepValue(person, key)).toBe(value)
      }
    })

    it('should give value with nested keys', () => {
      const truthy: [string, any][] = [
        ['bio.joinDate', 'today'],
        ['bio.facebook.link', '/facebook/james'],
        ['bio.facebook.likes', 1700]
      ]

      for (const [key, value] of truthy) {
        expect(getDeepValue(person, key)).toBe(value)
      }
    })

    it('should give undefined if simple key is not set', () => {
      expect(getDeepValue(person, 'dob')).toBe(undefined)
    })

    it('should give undefined if nested key is not set', () => {
      expect(getDeepValue(person, 'address.streetName')).toBe(undefined)
    })
  })
}

export const hasDeepKey_Tests = ({ hasDeepKey }: { hasDeepKey: Function }) => {
  describe('hasDeepKey', () => {
    const user = {
      name: 'James',
      bio: {
        facebook: { displayName: 'james-1' },
        twitter: { followers: '25k' }
      }
    }

    it('should tell if an object has simple key', () => {
      expect(hasDeepKey(user, 'name')).toBe(true)
      expect(hasDeepKey(user, 'age')).toBe(false)
    })

    it('should tell if an object has nested key', () => {
      const values = [
        ['address.street.name', false],
        ['address.street', false],
        ['bio.facebook', true],
        ['bio.facebook.displayName', true],
        ['bio.twitter.followers', true],
        ['bio.twitter.displayName', false]
      ]

      for (const [key, value] of values)
        expect(hasDeepKey(user, key)).toBe(value)
    })
  })
}

export const removeDeep_Tests = ({ removeDeep }: { removeDeep: Function }) => {
  describe('removeDeep', () => {
    let user: any

    beforeEach(() => {
      user = {
        name: 'James',
        bio: {
          facebook: { displayName: 'james-1' },
          twitter: { followers: '25k' }
        }
      }
    })

    it('should do nothing with empty key', () => {
      const values = [{}, { age: 17 }]

      for (const value of values) expect(removeDeep(value, '')).toEqual(value)
    })

    it('should not modify object if key is missing', () => {
      removeDeep(user, 'age')
      removeDeep(user, 'bio.instagram')
      expect(user).toMatchObject(user)
    })

    it('should remove a simple key', () => {
      removeDeep(user, 'age')
      expect(user).toMatchObject(user)
      expect(user).toMatchObject({
        bio: {
          facebook: { displayName: 'james-1' },
          twitter: { followers: '25k' }
        }
      })
    })

    it('should remove a nested key', () => {
      removeDeep(user, 'bio.facebook.displayName')
      removeDeep(user, 'bio.twitter')
      expect(user).toMatchObject({ bio: { facebook: {} } })
    })
  })
}

export const removeEmpty_Tests = ({
  removeEmpty
}: {
  removeEmpty: Function
}) => {
  const user = {
    bio: { twitter: { displayName: 'jamezz', link: '/facebook/jamezz' } },
    bio1: { twitter: { displayName: 'jamezz', link: undefined } },
    bio2: { twitter: {} },
    dob: '02/02/1895',
    joinDate: 'today',
    name: 'James',
    password: '1234'
  }

  describe('removeEmpty', () => {
    it('should only remove empty values', () => {
      expect(removeEmpty({ ...user }, 'bio.twitter.link')).toEqual(user)

      expect(removeEmpty({ ...user }, 'bio1.twitter.link')).toEqual({
        ...user,
        bio1: { twitter: { displayName: user.bio1.twitter.displayName } }
      })

      expect(removeEmpty({ ...user }, 'bio2.twitter.link')).toEqual(
        (() => {
          const { bio2, ...rest } = user

          return rest
        })()
      )
    })
  })
}
