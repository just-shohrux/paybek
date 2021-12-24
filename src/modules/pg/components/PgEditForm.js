import React from 'react';
import styled from "styled-components";
import {Controller, useForm} from "react-hook-form";
import {get, includes, isEmpty,isEqual} from "lodash";
import {Col, Row} from "react-grid-system";
import BaseButton from "../../../components/base-button";
import FormInput from "../../../components/form-input";
import FormSelect from "../../../components/form-select/FormSelect";
import Text from "../../../components/text";

const StyledPgGroupEditForm = styled.form`


`;

const PgEditForm = ({
                             createOrEdit = () => {
                                 console.log('login')
                             }, pg = {}, countries = [], ...props
                         }) => {
    const {register, handleSubmit, formState: {errors}, control, setValue} = useForm();
    const onSubmit = (data) => {
        createOrEdit(data);
    }

    countries = countries.map(({id, name}) => ({value: id, label: name})) || [];

    return (
        <StyledPgGroupEditForm {...props} onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col xs={5}>
                    <Row className={'mb-16'}>
                        <Col xs={12}>
                            <FormSelect rule={{required: true}} disabled left={4} right={8} defaultValue={1} options={[{value: 1, label: 'Stripe'}]}
                                        setValue={setValue} Controller={Controller} control={control} name={'stripe'} error={errors?.stripe}
                                        label={'PG'} placeholder={'Select PG'}/>
                        </Col>
                    </Row>
                    <Row className={'mb-16'}>
                        <Col xs={12}>
                            <FormSelect
                                disabled
                                defaultValue={get(pg, 'country.id', null)}
                                options={countries}
                                setValue={setValue} Controller={Controller} control={control}
                                error={errors?.countryIsos}
                                rule={{required: true}}
                                name={'countryIsos'} label={'Country'} placeholder={'Choose Countries'}
                            />
                        </Col>
                    </Row>
                    <Row className={'mb-16'}>
                        <Col xs={12}>
                            <FormInput  defaultValue={get(pg, 'paybekMargin', null)} register={register}
                                       name={'paybekMargin'} label={'Paybek Margin'} placeholder={'Paybek Margin'}
                                       validation={{required: true}} error={errors?.paybekMargin} measure={'%'}/>
                        </Col>
                    </Row>
                    <Row className={'mb-16'}>
                        <Col xs={12}>
                            <FormInput defaultValue={get(pg, 'volumeFee', null)} register={register} name={'volumeFee'}
                                       label={'Volume Fee'} placeholder={'Volume Fee'} validation={{required: true}}
                                       error={errors?.volumeFee} measure={'%'}/>
                        </Col>
                    </Row>
                    <Row className={'mb-16'}>
                        <Col xs={12}>
                            <FormInput defaultValue={get(pg, 'txnFee', null)} register={register} name={'txnFee'}
                                       label={'Txn Fee'} placeholder={'Txn Fee'} validation={{required: true}}
                                       error={errors?.txnFee} />
                        </Col>
                    </Row>

                    <Row className={'mb-32'}>
                        <Col xs={12}>
                            <FormSelect
                                rule={{required: true}}
                                defaultValue={isEqual(get(pg, 'active'),true) ? 'ACTIVE' : 'INACTIVE'}
                                options={[{value: 'INACTIVE', label: 'INACTIVE'}, {value: 'ACTIVE', label: 'ACTIVE'}]}
                                setValue={setValue} Controller={Controller} control={control} name={'active'}
                                error={errors?.active}
                                label={'Status'} placeholder={'Select Status'}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={8} offset={{xs: 4}}>
                            <BaseButton disabled={!isEmpty(errors)} type={'submit'} primary medium>Save</BaseButton>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </StyledPgGroupEditForm>
    );
};

export default PgEditForm;
