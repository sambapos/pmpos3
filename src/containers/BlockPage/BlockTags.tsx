import * as React from 'react';
import Block from '../../models/Block';
import Chip from 'material-ui/Chip/Chip';
import decorate, { Style } from './style';
import { WithStyles } from 'material-ui';

const BlockTags = (props: { block: Block } & WithStyles<keyof Style>) => {
    if (!props.block.tags) { return null; }
    return (
        <div className={props.classes.blockTags}>
            {Object.keys(props.block.tags).map(prop => {
                return <Chip key={prop} label={`${prop}: ${props.block.tags[prop]}`} />;
            })}
        </div>
    );
};

export default decorate(BlockTags);