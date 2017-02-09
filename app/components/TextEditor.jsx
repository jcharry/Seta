/*
 * TextEditor.jsx
 * Copyright (C) 2017 jamiecharry <jamiecharry@172-16-231-4.DYNAPOOL.NYU.EDU>
 *
 * Distributed under terms of the MIT license.
 */
import React from 'react';
import CodeMirror from 'react-codemirror';

class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        this.updateCode = this.updateCode.bind(this);
        this.state = {
            code: 'var b = 3;'
        };
    }

    updateCode(newCode) {
        this.setState({
            code: newCode
        });
    }

    render() {
        const options = {
            lineNumbers: true
        };
        return (
            <div className='text-editor'>
                <CodeMirror value={this.state.code} onChange={this.updateCode} options={options} />
            </div>
        );
    }
}

export default TextEditor;
