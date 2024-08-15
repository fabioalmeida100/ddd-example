import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendConsoleLog1WhenCustomerCreatedHandler from "./handler/send-console-log1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerCreatedHandler from "./handler/send-console-log2-when-customer-is-created.handler";
import CustomerCreatedEvent from "./customer-created.event";
import Address from "../value-object/address";

describe("Domain events tests - customer created event", () => {
  it("should register an event handler", () => {

    //Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendConsoleLog1WhenCustomerCreatedHandler();
    const eventHandler2 = new SendConsoleLog2WhenCustomerCreatedHandler()
    const nameOfEvent = CustomerCreatedEvent.constructor.name.toString();

    //Act
    eventDispatcher.register(nameOfEvent, eventHandler1);
    eventDispatcher.register(nameOfEvent, eventHandler2);

    //Assert
    expect(eventDispatcher.getEventHandlers[nameOfEvent]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[nameOfEvent].length).toBe(2);
    expect(eventDispatcher.getEventHandlers[nameOfEvent][0]).toMatchObject(eventHandler1);
    expect(eventDispatcher.getEventHandlers[nameOfEvent][0]).toMatchObject(eventHandler2);
  });

  it("should unregister an event handler", () => {
    //Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendConsoleLog1WhenCustomerCreatedHandler();
    const eventHandler2 = new SendConsoleLog2WhenCustomerCreatedHandler()
    const nameOfEvent = CustomerCreatedEvent.constructor.name.toString();

    //Act
    eventDispatcher.register(nameOfEvent, eventHandler1);
    eventDispatcher.register(nameOfEvent, eventHandler2);
    eventDispatcher.unregister(nameOfEvent, eventHandler2);

    //Assert
    expect(eventDispatcher.getEventHandlers[nameOfEvent]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[nameOfEvent].length).toBe(1);
  });

  it("should unregister all event handlers", () => {
    //Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendConsoleLog1WhenCustomerCreatedHandler();
    const eventHandler2 = new SendConsoleLog2WhenCustomerCreatedHandler()
    const nameOfEvent = CustomerCreatedEvent.constructor.name.toString();

    eventDispatcher.register(nameOfEvent, eventHandler1);
    eventDispatcher.register(nameOfEvent, eventHandler2);
    expect(eventDispatcher.getEventHandlers[nameOfEvent].length).toBe(2);

    //Act
    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers[nameOfEvent]).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    //Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new SendConsoleLog1WhenCustomerCreatedHandler();
    const eventHandler2 = new SendConsoleLog2WhenCustomerCreatedHandler()
    const nameOfEvent = CustomerCreatedEvent.constructor.name;
    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    eventDispatcher.register(nameOfEvent, eventHandler1);
    eventDispatcher.register(nameOfEvent, eventHandler2);

    expect(eventDispatcher.getEventHandlers[nameOfEvent][0]).toMatchObject(eventHandler1);
    expect(eventDispatcher.getEventHandlers[nameOfEvent][1]).toMatchObject(eventHandler2);

  
    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "João da Silva Peixoto",
      address: new Address("Rua Amaral", 10, "10928-387", "São Paulo")
    });

    //Act
    eventDispatcher.notify(customerCreatedEvent);

    //Assert
    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
  });
});
