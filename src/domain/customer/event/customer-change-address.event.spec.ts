import EventDispatcher from "../../@shared/event/event-dispatcher";
import SendConsoleLog1WhenCustomerCreatedHandler from "./handler/send-console-log1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerCreatedHandler from "./handler/send-console-log2-when-customer-is-created.handler";
import Address from "../value-object/address";
import CustomerChangeAddressEvent from "./customer-change-address.event";
import SendConsoleLogWhenCustomerAddressChangedHandler from "./handler/send-console-log-when-address-changed.handler";

describe("Domain events tests - customer change address event", () => {
  it("should register an event handler", () => {

    //Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenCustomerAddressChangedHandler();
    const nameOfEvent = "CustomerChangeAddressEvent";

    //Act
    eventDispatcher.register(nameOfEvent, eventHandler);

    //Assert
    expect(eventDispatcher.getEventHandlers[nameOfEvent]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[nameOfEvent].length).toBe(1);
    expect(eventDispatcher.getEventHandlers[nameOfEvent][0]).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    //Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenCustomerAddressChangedHandler();
    const nameOfEvent = "CustomerChangeAddressEvent";

    //Act
    eventDispatcher.register(nameOfEvent, eventHandler);
    eventDispatcher.unregister(nameOfEvent, eventHandler);

    //Assert
    expect(eventDispatcher.getEventHandlers[nameOfEvent]).toBeDefined();
    expect(eventDispatcher.getEventHandlers[nameOfEvent].length).toBe(0);
  });

  it("should unregister all event handlers", () => {
    //Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenCustomerAddressChangedHandler();
    const nameOfEvent = "CustomerChangeAddressEvent";

    eventDispatcher.register(nameOfEvent, eventHandler);
    expect(eventDispatcher.getEventHandlers[nameOfEvent].length).toBe(1);

    //Act
    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers[nameOfEvent]).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    //Arrange
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogWhenCustomerAddressChangedHandler();
    const nameOfEvent = "CustomerChangeAddressEvent";
    const spyEventHandler1 = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register(nameOfEvent, eventHandler);

    expect(eventDispatcher.getEventHandlers[nameOfEvent][0]).toMatchObject(eventHandler);

    const customerCreatedEvent = new CustomerChangeAddressEvent({
      id: '1',
      name: "João da Silva Peixoto",
      address: new Address("Rua Amaral", 10, "10928-387", "São Paulo").toString()
    });

    //Act
    eventDispatcher.notify(customerCreatedEvent);

    //Assert
    expect(spyEventHandler1).toHaveBeenCalled();
  });
});
