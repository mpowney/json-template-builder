import { DefaultButton, Dropdown, getTheme, IDropdownOption, IModalProps, Modal, PrimaryButton, Spinner, SpinnerSize, Stack, Text, TextField } from "@fluentui/react"
import React from "react";
import { IUser, PACKAGE_NAME } from "../App";
import { getLogger } from "../common/utils/InitLogger";
import styles from "./UnauthorizedModal.module.scss";

interface IUnauthorizedModalProps extends IModalProps {
    user: IUser | null;
    logoutHandler: () => void;
}

export const UnauthorizedModal: React.FunctionComponent<IUnauthorizedModalProps> = (props: IUnauthorizedModalProps) => {

    const [ submitted, setSubmitted ] = React.useState<boolean>(false);
    const [ processing, setProcessing ] = React.useState<boolean>(false);
    const [ notValidMessage, setNotValidMessage ] = React.useState<string | null>(null);
    const [ name, setName ] = React.useState<string>();
    const [ emailAddress, setEmailAddress ] = React.useState<string>();
    const [ ownersCorporationNumber, setOwnersCorporationNumber ] = React.useState<string>();
    const [ lotNo, setLotNo ] = React.useState<string>();
    const [ addressLine1, setAddressLine1 ] = React.useState<string>();
    const [ addressLine2, setAddressLine2 ] = React.useState<string>();
    const [ suburb, setSuburb ] = React.useState<string>();
    const [ state, setState ] = React.useState<string>();
    const [ postcode, setPostcode ] = React.useState<string>();
    const log = getLogger("UnauthorizedModal.tsx");

    const submitRequest = async () => {
        setProcessing(true);

        if (!name || !emailAddress || !addressLine1 || !postcode || !suburb || !state) {
            setProcessing(false);
            setNotValidMessage("Please fill in the required fields");
            return;
        }
        setProcessing(false);
    }

    const signoutClick = () => {
        props.logoutHandler();
    }

    const stateDropdownOptions = [
        { key: 'ACT', text: 'Australian Captital Territory' },
        { key: 'NSW', text: 'New South Wales' },
        { key: 'NT', text: 'Northern Territory' },
        { key: 'QLD', text: 'Queensland' },
        { key: 'SA', text: 'South Australia' },
        { key: 'TAS', text: 'Tasmania' },
        { key: 'VIC', text: 'Victoria' },
        { key: 'WA', text: 'Western Australia' }
    ];

    const theme = getTheme();

    return (
        <Modal {...props} className={styles.unauthorizedModal}>
            <div className={styles.unauthorizedModalContainer}>
                { submitted 
                    ? <Stack>
                        <Text variant={"xLarge"}>Thank-you</Text>
                        <Text>We'll be in touch shortly to let you know the outcome of your request</Text>
                    </Stack>
                    : <Stack tokens={{ childrenGap: 12 }}>
                        <Text variant={"xLarge"}>Sorry, you don't have access to { PACKAGE_NAME }</Text>
                        <Text>Let's get started by finding out more about you and your property</Text>
                        <Stack>
                            <TextField label={"Sign in address"} readOnly={props.user != null && props.user?.loginName.length > 0} value={props.user?.loginName} />
                            <TextField label={"Your name"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setName(value) } />
                            <TextField label={"Your e-mail address"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setEmailAddress(value) } />
                            <Stack tokens={{ childrenGap: 6}}>
                                <TextField label={"Your address"} placeholder={"Line 1"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setAddressLine1(value) } />
                                <TextField placeholder={"Line 2"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setAddressLine2(value) } />
                                <Stack horizontal tokens={{ childrenGap: 12}} className={styles.desktopSuburbStatePostcode}>
                                    <TextField style={{minWidth: 220}} placeholder={"Suburb"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setSuburb(value) } />
                                    <Dropdown placeholder={"State"} style={{minWidth: 200}} options={stateDropdownOptions} onChange={(event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption) => setState((item?.key || "").toString())} />
                                    <TextField style={{maxWidth: 100}} placeholder={"Postcode"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setPostcode(value) } />
                                </Stack>
                                <Stack tokens={{ childrenGap: 6}} className={styles.mobileSuburbStatePostcode}>
                                    <Stack horizontal tokens={{ childrenGap: 12}}>
                                        <TextField style={{minWidth: 190}} placeholder={"Suburb"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setSuburb(value) } />
                                        <TextField style={{maxWidth: 100}} placeholder={"Postcode"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setPostcode(value) } />
                                    </Stack>
                                    <Dropdown placeholder={"State"} style={{minWidth: 200}} options={stateDropdownOptions} onChange={(event: React.FormEvent<HTMLDivElement>, item?: IDropdownOption) => setState((item?.key || "").toString())} />
                                </Stack>
                            </Stack>
                            <TextField label={"Owners Corporation Number"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setOwnersCorporationNumber(value) } />
                            <TextField label={"Lot no"} onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, value?: string) => setLotNo(value) } />
                        </Stack>
                        {notValidMessage && <Text style={{color: theme.semanticColors.errorText }}>{notValidMessage}</Text>}
                        <Stack.Item align="end">
                            <Stack horizontal tokens={{ childrenGap: 12}}>
                                <DefaultButton onClick={signoutClick}>Sign out</DefaultButton>
                                {processing && <Spinner size={SpinnerSize.xSmall} style={{marginRight: 10}} />}
                                <PrimaryButton disabled={processing} onClick={submitRequest}>Request access</PrimaryButton>
                            </Stack>
                        </Stack.Item>
                    </Stack>
                }
            </div>
        </Modal>
    );
}

