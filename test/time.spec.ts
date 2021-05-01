import * as time from '../api/v1/time'

describe('Test time API', () => {
  it('sould get time', async () => {
    const timeResponse = await time.time()
    expect(timeResponse.time).toBeDefined()
  })
})
