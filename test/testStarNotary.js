const StarNotary = artifacts.require('StarNotary')

let account
let instance

contract('StarNotary', (accounts) => {
    account = accounts[0]
})

it('create star', async () => {
    instance = await StarNotary.deployed()
    await instance.createStar.call("star1", 1, {from : account})
    const star = await instance.starTokenMap.call(1)
    console.log(star.name)
})
