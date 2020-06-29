export interface BookItem {
  userId: string
  bookId: string
  createdAt: string
  name: string
  author: string
  category: string
  dueDate: string
  status: string
  coverUrl?: string
}
