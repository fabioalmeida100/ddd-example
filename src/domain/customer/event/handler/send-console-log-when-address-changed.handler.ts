import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-change-address.event";

export default class SendConsoleLogWhenCustomerAddressChangedHandler
  implements EventHandlerInterface<CustomerChangeAddressEvent>
{
  handle(event: CustomerChangeAddressEvent): void {
    const { eventData } = event;

    const id = eventData.id;
    const name = eventData.name;
    const address = eventData.address;
    
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address}`);
  }
}
