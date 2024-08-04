import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";
import { or } from "sequelize";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    //Arrange
    const product = await createProduct("123");
    const orderItem = createOrderItem(product, "123");
    const order = await createOrder(orderItem, "123", "123");

    // Act
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    // Assert
    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find an order", async () => {
    // Arrange
    const product = await createProduct("123");
    const orderItem = createOrderItem(product, "123");
    const order = await createOrder(orderItem, "123", "123");

    // Act
    const orderRepository = new OrderRepository();
    const orderFound = await orderRepository.find(order.id);

    // Assert
    expect(orderFound).toStrictEqual(order);
  });

  it("should find all orders", async () => {
    // Arrange
    const product = await createProduct("123");
    const orderItem = createOrderItem(product, "123");
    const order1 = await createOrder(orderItem, "123", "123");

    const orderItem2 = createOrderItem(product, "124");
    const order2 = await createOrder(orderItem2, "124", "124");

    // Act
    const orderRepository = new OrderRepository();
    const orders = await orderRepository.findAll();

    // Assert
    expect(orders).toStrictEqual([order1, order2]);
  });

  it("should update an order", async () => {
    // Arrange
    const product = await createProduct("123");
    const orderItem = createOrderItem(product, "123");
    const order = await createOrder(orderItem, "123", "123");

    createCustomer("124");
    order.changeCustomer("124");
    const orderItem2 = createOrderItem(product, "124");
    order.addItem(orderItem2);

    // Act
    const orderRepository = new OrderRepository();
    await orderRepository.update(order);

    // Assert
    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "124",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  // Helper function to create a new order

  async function createOrder(orderItem: OrderItem, orderId: string, customerId: string): Promise<Order> {
    // Create a new customer
    createCustomer(customerId);

    // Create a new order
    const order = new Order(orderId, "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    return order;
  }
});

async function createCustomer(customerId: string) {
  const customerRepository = new CustomerRepository();
  const customer = new Customer(customerId, "Customer 1");
  const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
  customer.changeAddress(address);
  return await customerRepository.create(customer);
}

async function createProduct(id: string): Promise<Product> {
  const productRepository = new ProductRepository();
  const product = new Product(id, "Product 1", 10);
  await productRepository.create(product);
  return product;
}

function createOrderItem(product: Product, orderItemId: string): OrderItem {
  return new OrderItem(
    orderItemId,
    product.name,
    product.price,
    product.id,
    2
  );
}

