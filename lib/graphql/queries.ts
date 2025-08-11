import { gql } from '@apollo/client';

export const GET_RECEIPTS_QUERY = gql`
  query GetReceipts($page: Int!, $limit: Int!, $category: String) {
    receipts(page: $page, limit: $limit, category: $category) {
      message
      data {
        receipts {
          id
          storeName
          dateOfPurchase
          totalAmount
          category
          items {
            id
            name
            price
          }
        }
        totalCount
        totalPages
        currentPage
      }
    }
  }
`;

export const GET_SINGLE_RECEIPT_QUERY = gql`
  query GetSingleReceipt($id: ID!) {
    receipt(id: $id) {
      message
      receipt {
        id
        storeName
        dateOfPurchase
        totalAmount
        category
        items {
          id
          name
          price
        }
        user {
          id
          name
          email
        }
      }
    }
  }
`;