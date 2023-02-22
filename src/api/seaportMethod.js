import {ethers} from "ethers";
import {provider, seaport} from "./seaport";
import {ItemType} from '@opensea/seaport-js/lib/constants';

// createOrder ether => 721, 20 => 721 721 => ether, 20 => 721
const createOrder721ToEther = async (
    _endTime,
    offerItemType = ItemType.ERC721,
    offerItemAddr,
    offerItemId,
    offerItemAmount = "1",
    considerationType = ItemType.NATIVE,
    considerationAddr = "0x0000000000000000000000000000000000000000",
    considerationId = "0",
    considerationAmount,
    recipient
) => {
    try {
        const orderCreate = await seaport.createOrder({
            endTime: _endTime,
            offer: [{
                itemType: offerItemType,
                token: offerItemAddr,
                identifier: offerItemId,
                amount: offerItemAmount,
                endAmount: offerItemAmount
            }],
            consideration: [{
                itemType: considerationType,
                token: considerationAddr,
                amount: considerationAmount,
                endAmount: considerationAmount,
                identifier: considerationId,
                recipient: recipient
            }],
        }, recipient);

        const order = await orderCreate.executeAllActions();

        return order;
    } catch (error) {
        console.log(error)
        return error
    }
}

const createOrder721To20 = async (
    _endTime,
    offerItemType,
    offerItemAddr = ItemType.ERC721,
    offerItemId,
    offerItemAmount = "1",
    considerationType = ItemType.ERC20,
    considerationAddr,
    considerationId = "0",
    considerationAmount,
    recipient
) => {
    try {
        const orderCreate = await seaport.createOrder({
            endTime: _endTime,
            offer: [{
                itemType: offerItemType,
                token: offerItemAddr,
                identifier: offerItemId,
                amount: offerItemAmount,
                endAmount: offerItemAmount
            }],
            consideration: [{
                itemType: considerationType,
                token: considerationAddr,
                amount: "1",
                endAmount: "1",
                identifier: considerationId,
                recipient: recipient
            }],
        });

        const order = await orderCreate.executeAllActions();

        return order;
    } catch (error) {
        console.log(error)
        return error
    }
}

const createOrder20To721 = async (
    _endTime,
    offerItemType,
    offerItemAddr = ItemType.ERC20,
    offerItemId,
    offerItemAmount,
    considerationType = ItemType.ERC721,
    considerationAddr,
    considerationId = "0",
    considerationAmount = "1",
    recipient
) => {
    try {
        const orderCreate = await seaport.createOrder({
                conduitKey: "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
                zone: "0x00000000E88FE2628EbC5DA81d2b3CeaD633E89e",
                zoneHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
                endTime: _endTime,
                offer: [{
                    itemType: offerItemType,
                    token: offerItemAddr,
                    identifier: offerItemId,
                    amount: offerItemAmount,
                    endAmount: offerItemAmount
                }],
                consideration: [{
                    itemType: considerationType,
                    token: considerationAddr,
                    amount: considerationAmount,
                    endAmount: considerationAmount,
                    identifier: considerationId,
                    recipient: recipient
                }],
                // counter: 0, seaport
                allowPartialFills: false,
                restrictedByZone: true, // zone
                fees: [{recipient: "0x0000a26b00c1F0DF003000390027140000fAa719", basisPoints: 250}],
            }, recipient
        );

        const order = await orderCreate.executeAllActions();

        return order;
    } catch (error) {
        console.log(error)
        return error
    }
}

const fulfillOrder = async (order) => {
    try {
        const {executeAllActions: executeAllFulfillActions} = await seaport.fulfillOrder({
            order: order
        });

        const transaction = await executeAllFulfillActions();

        return transaction;
    } catch (error) {
        console.log(error)
        return error
    }
}

const cancelOrder = async (order) => {
    try {
        const orderCancel = await seaport.cancelOrders([order.parameters]).transact();

        return orderCancel;
    } catch (error) {
        console.log(error)
        return error
    }
}

export {
    createOrder721ToEther,
    createOrder721To20,
    createOrder20To721,
    fulfillOrder,
    cancelOrder
};
