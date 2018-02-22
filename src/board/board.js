import React, { Component } from 'react'
import Card from '../card/card'

export default class Board extends Component {
  constructor() {
    super()
    this.state = {
      firstCard: null,
      disableAll: false,
    }
  }

  handleCardClick(currentCard) {
    const { firstCard } = this.state
    const cards = {}
    if (firstCard) {
      cards['card1'] = firstCard
    }
    cards['card2'] = currentCard
    this.flipCard(cards)
    if (firstCard) {
      if (firstCard.value === currentCard.value) {
        this.handleMatch(cards)
      } else {
        this.handleMismatch(cards)
      }
      this.setState({firstCard: null})
    }
    if (!firstCard){
      this.setState({firstCard: cards['card2']})
      this.props.renderMessage('select a second card')
    }
  }

  flipCard(cards) {
    const statusChange = {flipped: true}
    const newCardState = Board.updateCardsState(cards, statusChange)
    this.props.updateDeck(newCardState)
  }

  //matched + flipped state become true for both cards
  handleMatch(cards) {
    const statusChange = {matched: true, flipped: true}
    const newCardState = Board.updateCardsState(cards, statusChange)
    this.props.renderMessage('matched!', true)
    setTimeout(() => this.props.updateDeck(newCardState), 1000)
    setTimeout(() => this.props.renderMessage('select a new card'), 1500)
  }

  handleFlip(card) {
    return Board.updateCardsState(card, {flipped: true})
  }

  //set flipped state back to false for both cards
  handleMismatch(cards) {
    this.setState({disableAll: true}) //disable every card from being clicked
    const newCardState = Board.updateCardsState(cards, {flipped: false})
    this.props.renderMessage('mismatched')
    setTimeout(() => {
      this.props.updateDeck(newCardState)
      this.setState({disableAll: false})
      this.props.renderMessage('select a new card')
    }, 1000)
  }

  render() {
    const deckArray = Object.values(this.props.deck)
    const {disableAll} = this.state
    const boardRender = deckArray.map((card) => {
      let {id, value, flipped, matched, icon} = card
      let cardProps = {
        value, flipped, matched, icon, disableAll,
        handleCardClick: () => this.handleCardClick(card)
      }
      return <Card key={id} {...cardProps}/>
    })
    const boardStyle = {
      display: 'flex',
      flexWrap: 'wrap',
      maxWidth: '1325px'
    }
    return (
      <div style={boardStyle}>
        {boardRender}
      </div>
    )
  }

  //merges every object with the status of my choosing
  static updateCardsState(cards, status) {
    const newCardsState = {}
    for (let key in cards) {
      let currentCard = cards[key]
      newCardsState[currentCard.position] = {
        ...currentCard, ...status
      }
    }
    return newCardsState
  }
}
