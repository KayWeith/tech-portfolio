let deckId
let computerScore = 0
let playerScore = 0
const cardsContainer = document.getElementById("cards")
const newDeckBtn = document.getElementById("new-deck")
const drawCardBtn = document.getElementById("draw-cards")
const header = document.getElementById("header")
const remainingText = document.getElementById("remaining")
const computerScoreEl = document.getElementById("computer-score")
const playerScoreEl = document.getElementById("player-score")
const deckEl = document.getElementById("deck-img")

drawCardBtn.disabled = true

function handleClick() {
    fetch("https://deckofcardsapi.com/api/deck/new/")
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            deckId = data.deck_id
            deckEl.innerHTML = `<img src="https://deckofcardsapi.com/static/img/back.png" class="deck">`
            computerScore = 0
            playerScore = 0
            computerScoreEl.textContent = `Computer score: ${computerScore}`
            playerScoreEl.textContent = `Your score: ${playerScore}`
            cardsContainer.children[0].innerHTML = `Computer`
            cardsContainer.children[1].innerHTML = `You`
            header.textContent = `A simplified game of war.`
            drawCardBtn.disabled = false
        })
}

newDeckBtn.addEventListener("click", handleClick)

drawCardBtn.addEventListener("click", () => {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then(res => res.json())
        .then(data => {
            remainingText.textContent = `Remaining cards: ${data.remaining}`
            cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
            `
            cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
            `
            const winnerText = determineCardWinner(data.cards[0], data.cards[1])
            header.textContent = winnerText
            
            if (data.remaining === 0) {
                drawCardBtn.disabled = true
                deckEl.innerHTML = `Get new deck`
                if (computerScore > playerScore) {
                    // display "The computer won the game!"
                    header.textContent = "The computer won the game!"
                } else if (playerScore > computerScore) {
                    // display "You won the game!"
                    header.textContent = "You won the game!"
                } else {
                    // display "It's a tie game!"
                    header.textContent = "It's a tie game!"
                }
            }
        })
})

function determineCardWinner(card1, card2) {
    const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9", 
    "10", "JACK", "QUEEN", "KING", "ACE"]
    const card1ValueIndex = valueOptions.indexOf(card1.value)
    const card2ValueIndex = valueOptions.indexOf(card2.value)
    
    if (card1ValueIndex > card2ValueIndex) {
        computerScore++
        computerScoreEl.textContent = `Computer score: ${computerScore}`
        return "Computer wins!"
    } else if (card1ValueIndex < card2ValueIndex) {
        playerScore++
        playerScoreEl.textContent = `Your score: ${playerScore}`
        return "You win!"
    } else {
        return "War!"
    }
}

