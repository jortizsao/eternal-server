const image = `
  type Dimensions {
    width: Int!
    height: Int!
  }

  type Image {
    url: String!
    dimensions: Dimensions!
    label: String
  }
`;
export default () => [image];
