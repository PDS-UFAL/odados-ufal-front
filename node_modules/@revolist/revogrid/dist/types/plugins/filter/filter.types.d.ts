export declare type DateEnum = 'today' | 'yesterday' | 'tomorrow' | 'thisweek' | 'lastweek' | 'nextweek' | 'thismonth' | 'lastmonth' | 'nextmonth' | 'thisyear' | 'lastyear' | 'nextyear';
export declare type ExtraField = 'input' | 'select' | 'multi' | 'datepicker';
export declare type LogicFunctionParam = any;
export declare type LogicFunctionExtraParam = 'select' | 'input' | 'multi' | 'datepicker' | undefined | string | number | Date | DateEnum | null | undefined | string[] | number[];
export declare type LogicFunction = {
  (value: LogicFunctionParam, extra?: LogicFunctionExtraParam): boolean;
  extra?: ExtraField;
};
