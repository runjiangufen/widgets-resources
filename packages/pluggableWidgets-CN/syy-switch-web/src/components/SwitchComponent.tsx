import { ReactElement, createElement } from "react";
import Switch, { SwitchProps } from "antd/lib/switch";

export interface SwitchComponentProps extends SwitchProps {
    loadingFlag: boolean;
    onName: string;
    offName: string;
}

export function SwitchComponent(props: SwitchComponentProps): ReactElement {
    const { checked, loadingFlag, disabled, onName, offName, autoFocus, size, onClick, onChange } = props;
    const options = {
        ...(onName && { checkedChildren: onName }),
        ...(offName && { unCheckedChildren: offName })
    };
    return (
        <Switch
            checked={checked || false}
            autoFocus={autoFocus || false}
            onChange={onChange}
            onClick={onClick}
            disabled={disabled}
            loading={loadingFlag}
            size={size}
            {...options}
        />
    );
}
