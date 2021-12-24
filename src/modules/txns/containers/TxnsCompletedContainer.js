import React, {useEffect, useRef, useState} from 'react';
import {get, isEmpty, round} from "lodash";
import {Col, Container, Row} from "react-grid-system";
import moment from "moment";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import completedIcon from "../../../assets/images/icons/completed.svg";
import BaseBreadcrumb from "../../../components/base-breadcrumb";
import Content from "../../../components/content";
import BaseTable from "../../../components/base-table";
import BaseSelect from "../../../components/base-select";
import BaseInput from "../../../components/base-input";
import BaseButton from "../../../components/base-button";
import Actions from "../Actions";
import AccountActions from "../../accounts/Actions";
import Normalizer from "../../../services/normalizer";
import ContentLoader from "../../../components/loader/ContentLoader";
import Flex from "../../../components/flex";
import CountryScheme from "../../../schema/CountryScheme";
import BasePagination from "../../../components/base-pagination";
import Text from "../../../components/text";
import ApiService from "../ApiService";
import {toast} from "react-toastify";
import Loader from "../../../components/loader";
import TxnsScheme from "../../../schema/TxnsScheme";
import BaseDatePicker from "../../../components/base-datepicker";
import {ReactSVG} from "react-svg";
import NumberFormat from "react-number-format";
import {saveFile} from "../../../utils";
import NormalizerActions from "../../../services/normalizer/actions";

const TxnsCompletedContainer = ({
                                    history,
                                    entities,
                                    txns,
                                    isFetched,
                                    countries,
                                    getCountryListDispatch,
                                    getTxnsListDispatch,
                                    totalPages,
                                    pageSize,
                                    pageNumber,
                                    setTriggerListDispatch
                                }) => {
    const [filter, setFilter] = useState({
        txnStatusEnum: "SUCCESSFUL",
        countryId: "",
        fromDate:moment('2021-09-01').format("YYYY-MM-DD"),
        toDate: moment().add(1, 'days').format("YYYY-MM-DD"),
        searchingField: "",
        size: pageSize,
        page: pageNumber
    });
    const [loading, setLoading] = useState(false);
    const [clear,setClear] = useState('');
    useEffect(() => {
        getCountryListDispatch();
    }, []);

    useEffect(() => {
        setTriggerListDispatch();
        getTxnsListDispatch({...filter});
    }, [filter]);



    const refCountrySelect = useRef();

    txns = Normalizer.Denormalize(txns, [TxnsScheme], entities);

    countries = Normalizer.Denormalize(countries, [CountryScheme], entities).map(({id, name}) => ({
        value: id,
        label: name
    }));


    const downloadExcelFile = () => {
        setLoading(true);
        ApiService.DownloadTxnsExcelFile(filter).then((res) => {
            if(res && res.data){
                setLoading(false);
                saveFile(res,moment(),'xlsx');
            }

        }).catch((e) => {
            setLoading(false);
            if (e.response.data && e.response.data.errors) {
                e.response.data.errors.map(({errorMsg}) => toast.error(`${errorMsg}`));
                return
            }
            toast.error('ERROR')
        })
    }

    const clearCountrySelect = () => {
        refCountrySelect.current.select.clearValue()
    }


    const clearSelect = () => {
        clearCountrySelect();
        setClear('');
        setFilter(filter => ({...filter, searchingField: ""}));
    }

    return (
        <Container fluid>
            <Row>
                <Col xs={12}>
                    {loading && <Loader/>}
                </Col>
                <Col xs={12} className={'mb-8'}>
                    <BaseBreadcrumb items={[{id: 1, name: 'TXNS', url: '/txns'},{id: 2, name: 'Completed', url: '/txns/completed'}]}/>
                </Col>
                <Col xs={12}>
                    <Content>
                        <Row align={'center'} className={'mb-16'}>
                            <Col xs={8}>
                                <Flex>
                                    <BaseDatePicker defaultDate={moment(get(filter,'fromDate')).toDate() } value={get(filter,'fromDate')}
                                                    handleDate={(date) => setFilter(filter => ({
                                                        ...filter,
                                                        fromDate: moment(date).format('YYYY-MM-DD')
                                                    }))} placeholder={'From'} classNAme={'mr-8'}/>
                                    <BaseDatePicker defaultDate={moment().add(1, 'days').toDate()} value={get(filter,'toDate')}
                                                    handleDate={(date) => setFilter(filter => ({
                                                        ...filter,
                                                        toDate: moment(date).format('YYYY-MM-DD')
                                                    }))} placeholder={'Till'} classNAme={'mr-8'} margin={'0 0 0 15px'}/>
                                    <BaseSelect ref={refCountrySelect} handleChange={(values) => setFilter(filter => ({
                                        ...filter,
                                        countryId: get(values, 'value', '')
                                    }))} options={countries} placeholder={'Filter by country'} width={'200px'}
                                                margin={'0 0 0 15px'}/>
                                    <BaseInput
                                        value={clear}
                                        handleInput={(val) => {setClear(val);setFilter(filter => ({...filter, searchingField: val}))}}
                                        placeholder={'Search by TXN Number/Phone number ...'} margin={'0 0 0 15px'} />
                                </Flex>
                            </Col>
                            <Col xs={4} className={'text-right'}>
                                <BaseButton handleClick={() => {
                                    setFilter(filter => ({...filter, fromDate:moment('2021-09-01').format("YYYY-MM-DD"),
                                        toDate: moment().add(1, 'days').format("YYYY-MM-DD"), roleId: "", countryId: ""}));
                                    clearSelect()
                                }} danger className={'mr-4'}>Reset</BaseButton>

                                <BaseButton handleClick={() => downloadExcelFile()}>Save as Excel</BaseButton>
                            </Col>

                        </Row>
                        <Row>
                            <Col xs={12} className={'mb-32'}>
                                {isFetched ?
                                    <BaseTable
                                        tableHeader={['TXN Number', 'Country Code', 'Sender', 'Payment Method', 'WD Amount', 'Amount Sent USD', 'Received', 'USD to Receive rate','USD to PG rate','Rec Number','Date','Status',]}>
                                        {!isEmpty(txns) ? txns.map((item, index) => <tr key={get(item, 'id', null)}>
                                            <td><Link to={'/txns/detail/'+get(item, 'id', null)}>{get(item, 'txnNumber', 0)}</Link></td>
                                            <td>{get(item, 'countryCode', '-')}</td>
                                            <td>{get(item, 'sender', '-')}</td>
                                            <td>{get(item, 'paymentMethod', '-')}</td>
                                            <td><NumberFormat displayType={'text'}
                                                              thousandSeparator={','}
                                                              value={round(get(item, 'wdAmount', 0), 2)}/></td>
                                            <td><NumberFormat displayType={'text'}
                                                              thousandSeparator={','}
                                                              value={round(get(item, 'amountUsd', ''), 2)}/></td>
                                            <td><NumberFormat displayType={'text'}
                                                              thousandSeparator={','}
                                                              value={round(get(item, 'receive', ''), 2)}/></td>
                                            <td><NumberFormat displayType={'text'}
                                                              thousandSeparator={','}
                                                              value={round(get(item, 'usdReceiveRate'), 4)}/></td>
                                            <td><NumberFormat displayType={'text'}
                                                              thousandSeparator={','}
                                                              value={round(get(item, 'usdRate'), 4)}/></td>
                                            <td>{get(item, 'phoneNumber')}</td>
                                            <td>{moment(get(item, 'date')).format('DD.MM.YYYY  hh:mm A')}</td>
                                            <td><ReactSVG src={completedIcon} /></td>
                                        </tr>) : <tr>
                                            <td colSpan={12}>No data</td>
                                        </tr>
                                        }
                                    </BaseTable> : <ContentLoader/>
                                }
                            </Col>
                        </Row>
                        {(totalPages > 0) && <Row align={'center'}>
                            <Col xs={4}>
                                <Flex>
                                    <Text>Show</Text><BaseSelect
                                    disabled
                                    handleChange={({value}) => setFilter(filter => ({...filter, size: value}))}
                                    defaultValue={pageSize} options={[{value: 5, label: 5}, {value: 10, label: 10}, {
                                    value: 25,
                                    label: 25
                                }, {value: 50, label: 50}]} margin={'0 12px 0 12px'} width={'80px'}
                                    placeholder={'Count'}/><Text>on the page</Text>
                                </Flex>
                            </Col>
                            <Col xs={8}><BasePagination current={pageNumber}
                                onChange={({selected}) => setFilter(filter => ({...filter, page: selected}))}
                                pageCount={totalPages}/></Col>
                        </Row>}
                    </Content>
                </Col>
            </Row>
        </Container>
    );
};

const mapStateToProps = (state) =>
{
    return {
        entities: get(state, 'normalizer.entities', {}),
        txns: get(state, 'normalizer.data.txns-list.result.content', []),
        isFetched: get(state, 'normalizer.data.txns-list.isFetched', false),
        countries: get(state, 'normalizer.data.country-list.result', []),
        totalPages: get(state, 'normalizer.data.txns-list.result.totalPages', 0),
        pageSize: get(state, 'normalizer.data.txns-list.result.size', 10),
        pageNumber: get(state, 'normalizer.data.txns-list.result.number', 0),
    }
}

const mapDispatchToProps = (dispatch) =>
{
    return {
        getTxnsListDispatch: (params) => dispatch({type: Actions.GET_TXNS_LIST.REQUEST, payload: {params}}),
        getCountryListDispatch: () => dispatch({
            type: AccountActions.GET_COUNTRY_LIST.REQUEST,
            payload: {params: {}}
        }),
        setTriggerListDispatch: () => dispatch({
            type: NormalizerActions.NORMALIZE.TRIGGER,
            payload: {storeName: 'txns-list'}
        }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TxnsCompletedContainer));
