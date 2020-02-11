import Batch,{OrderLine, allocate} from '../src/model'
const allocateHandler = (req: { query: { sku: any; qty: any; orderid: any; }; },res: { send: (arg0: string) => void; })=>{
    console.log(req);
    // extract order line from request
    const {sku, qty, orderid} = req.query
    const orderLine:OrderLine = {sku, qty, orderid} 
    console.log(`sku: ${sku}, qty: ${qty}, orderid: ${orderid}, `)
    // load all batches from the DB
    const batches = [new Batch('batchreference',sku,20)]
    // call our domain service
    const resp = allocate({orderLine, batches})
    // then save the allocation back to the database somehow
    res.send(`Allocate allocate from another file! resp:${resp}`)
}
export default allocateHandler