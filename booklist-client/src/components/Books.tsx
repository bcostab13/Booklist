import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Select,
  DropdownProps,
  ButtonProps
} from 'semantic-ui-react'

import { createBook, deleteBook, getBooks, patchBook } from '../api/books-api'
import Auth from '../auth/Auth'
import { Book } from '../types/Book'

const options = [
  { key: 'comics', text: 'Comics', value: 'comics' },
  { key: 'economy', text: 'Economy', value: 'economy' },
  { key: 'technology', text: 'Technology', value: 'technology' },
  { key: 'other', text: 'Other', value: 'other' }
]

interface BooksProps {
  auth: Auth
  history: History
}

interface BooksState {
  books: Book[]
  newBookName: string
  newBookAuthor: string
  newBookCategory: string
  loadingBooks: boolean
}

export class Books extends React.PureComponent<BooksProps, BooksState> {
  state: BooksState = {
    books: [],
    newBookName: '',
    newBookAuthor: '',
    newBookCategory: 'other',
    loadingBooks: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookName: event.target.value })
  }

  handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newBookAuthor: event.target.value })
  }

  handleCategoryChange = (event: React.SyntheticEvent, data: DropdownProps) => {
    this.setState({ newBookCategory: data && data.value && data.value.toString() || 'other' })
  }

  onEditButtonClick = (bookId: string) => {
    this.props.history.push(`/books/${bookId}/edit`)
  }

  onBookCreate = async (event: React.MouseEvent, data: ButtonProps) => {
    try {
      const dueDate = this.calculateDueDate()
      const newBook = await createBook(this.props.auth.getIdToken(), {
        name: this.state.newBookName,
        author: this.state.newBookAuthor,
        category: this.state.newBookCategory,
        dueDate
      })
      this.setState({
        books: [...this.state.books, newBook],
        newBookName: '',
        newBookAuthor: '',
        newBookCategory: 'other'
      })
    } catch {
      alert('Book creation failed')
    }
  }

  onBookDelete = async (bookId: string) => {
    try {
      await deleteBook(this.props.auth.getIdToken(), bookId)
      this.setState({
        books: this.state.books.filter(book => book.bookId != bookId)
      })
    } catch {
      alert('Book deletion failed')
    }
  }

  onBookCheck = async (pos: number) => {
    try {
      const book = this.state.books[pos]
      const status = book.status==='done'?'in process':'done'
      await patchBook(this.props.auth.getIdToken(), book.bookId, {
        dueDate: book.dueDate,
        status: status
      })
      this.setState({
        books: update(this.state.books, {
          [pos]: { status: { $set: status } }
        })
      })
    } catch {
      alert('Book deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const books = await getBooks(this.props.auth.getIdToken())
      this.setState({
        books,
        loadingBooks: false
      })
    } catch (e) {
      alert(`Failed to fetch books: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Booklist</Header>
        <Header as="h4">Manage a list of books you want to read soon</Header>

        {this.renderCreateBookInput()}

        {this.renderBooks()}
      </div>
    )
  }

  renderCreateBookInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>          
          <Input fluid type="text" action>
            <input placeholder="Name" value={this.state.newBookName} onChange={this.handleNameChange}/>
            <input placeholder="Author" value={this.state.newBookAuthor} onChange={this.handleAuthorChange}/>
            <Select compact options={options} defaultValue={this.state.newBookCategory} onChange={this.handleCategoryChange}/>
            <Button icon labelPosition='right' color='teal' onClick={this.onBookCreate}>Add Book
              <Icon name='add' />
            </Button>
          </Input>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderBooks() {
    if (this.state.loadingBooks) {
      return this.renderLoading()
    }

    return this.renderBooksList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Books
        </Loader>
      </Grid.Row>
    )
  }

  renderBooksList() {
    return (
      <Grid padded>
        {this.state.books.map((book, pos) => {
          return (
            <Grid.Row key={book.bookId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onBookCheck(pos)}
                  checked={book.status==='done'}
                />
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {book.coverUrl && (
                  <Image src={book.coverUrl} size="small" wrapped />
                )}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {book.name}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {book.author}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {book.category}
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle" floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(book.bookId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} verticalAlign="middle" floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onBookDelete(book.bookId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
