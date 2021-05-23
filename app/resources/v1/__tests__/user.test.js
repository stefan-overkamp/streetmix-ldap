/* eslint-env jest */
import request from 'supertest'
import { setupMockServer } from '../../../../test/helpers/setup-mock-server'
import user from '../users'

jest.mock('twitter')
jest.mock('../../../db/models')
jest.mock('../../../../lib/logger')

// mockUser is setting a mock 'sub' (which is an express/oAuth middlewhare thing),
// so that the below tests are authenticated. Don't confuse this with actual user data
// TODO: maybe we can rename these and make the tests more clear?

const mockUser = {
  sub: 'foo|123'
}
const mockAdminUser = {
  sub: 'admin|789'
}
const jwtMock = jest.fn() // returns a user
const mockUserMiddleware = (req, res, next) => {
  req.user = jwtMock()
  next()
}

describe('PUT api/v1/users/:user_id', () => {
  const app = setupMockServer((app) => {
    app.put('/api/v1/users/:user_id', mockUserMiddleware, user.put)
  })

  it('should respond with 204 user updates their own credentials', () => {
    jwtMock.mockReturnValueOnce(mockUser)
    return request(app)
      .put('/api/v1/users/user1')
      .type('json')
      .send(JSON.stringify({}))
      .then((response) => {
        expect(response.statusCode).toEqual(204)
      })
  })

  it('should respond with 401 if a user PUTs to a different user', () => {
    jwtMock.mockReturnValueOnce(mockUser)
    return request(app)
      .put('/api/v1/users/user2')
      .type('json')
      .send(JSON.stringify({}))
      .then((response) => {
        expect(response.statusCode).toEqual(401)
      })
  })

  it('should respond with 204 if an admin user PUTS to a different user', () => {
    jwtMock.mockReturnValueOnce(mockAdminUser)
    return request(app)
      .put('/api/v1/users/user1')
      .type('json')
      .send(JSON.stringify({}))
      .then((response) => {
        expect(response.statusCode).toEqual(204)
      })
  })
})

describe('GET api/v1/users/:user_id', function () {
  const app = setupMockServer((app) => {
    app.get('/api/v1/users/:user_id', mockUserMiddleware, user.get)
  })

  it('should respond with 200 when a user is found', () => {
    return request(app)
      .get('/api/v1/users/user1')
      .then((response) => {
        expect(response.statusCode).toEqual(200)
      })
  })
})

describe('DELETE api/v1/users/:user_id', () => {
  const app = setupMockServer((app) => {
    app.delete('/api/v1/users/:user_id', mockUserMiddleware, user.delete)
  })

  it('should respond with 204 when user DELETEs their account', () => {
    jwtMock.mockReturnValueOnce(mockUser)
    return request(app)
      .delete('/api/v1/users/user1')
      .then((response) => {
        expect(response.statusCode).toEqual(204)
      })
  })

  it('should respond with 401 if user DELETEs a different user account', () => {
    jwtMock.mockReturnValueOnce(mockUser)
    return request(app)
      .delete('/api/v1/users/user2')
      .then((response) => {
        expect(response.statusCode).toEqual(401)
      })
  })

  it('should respond with 204 when admin user DELETEs a different user account', () => {
    jwtMock.mockReturnValueOnce(mockAdminUser)
    return request(app)
      .delete('/api/v1/users/user1')
      .then((response) => {
        expect(response.statusCode).toEqual(204)
      })
  })
})