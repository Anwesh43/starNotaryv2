const StarNotary = artifacts.require('StarNotary')

let accounts
let instance

contract('StarNotary', (accs) => {
    accounts = accs
})

it('create star', async () => {
    instance = await StarNotary.deployed()
    const tokenId = 1
    const name = "star1"
    await instance.createStar(name, tokenId, {from : accounts[0]})
    console.log(accounts[0])
    console.log(instance.starTokenMap)
    const star = await instance.starTokenMap.call(tokenId)
    console.log(`star is ${star}`)
    assert.equal(star, name)
})

it('put up for sale', async () => {
    instance = await StarNotary.deployed()
    const tokenId = 2
    const name = "star2"
    const user = accounts[1]
    const price = web3.utils.toWei("0.01", "ether")
    await instance.createStar(name, tokenId, {from : user})
    await instance.putUpForSale(tokenId, price, {from : user})
    const starName = await instance.starTokenMap.call(tokenId)
    const starPrice = await instance.starsForSale.call(tokenId)
    console.log(starName)
    console.log(price)
    assert.equal(starName, name)
    assert.equal(starPrice, price)
})

it('buying stars', async () => {
    instance = await StarNotary.deployed()
    const buyer = accounts[0]
    const tokenId = 2
    const value = web3.utils.toWei(".01", "ether")
    await instance.buyStar(tokenId, {from : buyer, value})
    const tokenOwner = await instance.ownerOf.call(tokenId)
    console.log(`new owner : ${tokenOwner}, buyer was ${buyer}`)
    await assert.equal(tokenOwner, buyer)
})
