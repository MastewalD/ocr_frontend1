import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      message
      user {
        id
        email
        name
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      message
      user {
        id
        email
        name
      }
    }
  }
`;

export const UPLOAD_RECEIPT_MUTATION = gql`
  mutation UploadReceipt($file: Upload!, $category: String) {
    uploadReceipt(file: $file, category: $category) {
      message
      receipt {
        storeName
        dateOfPurchase
        totalAmount
        items {
          name
          price
        }
      }
    }
  }
`;

