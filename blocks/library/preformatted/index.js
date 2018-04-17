/**
 * WordPress
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './editor.scss';
import { createBlock, getPhrasingContentSchema } from '../../api';
import RichText from '../../rich-text';

export const name = 'core/preformatted';

export const settings = {
	title: __( 'Preformatted' ),

	description: __( 'Preformatted text keeps your spaces, tabs and linebreaks as they are.' ),

	icon: 'text',

	category: 'formatting',

	attributes: {
		content: {
			type: 'array',
			source: 'children',
			selector: 'pre',
		},
	},

	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( attributes ) =>
					createBlock( 'core/preformatted', attributes ),
			},
			{
				type: 'raw',
				isMatch: ( node ) => (
					node.matches( 'pre' ) &&
					! (
						node.children.length === 1 &&
						node.firstChild.matches( 'code' )
					)
				),
				schema: {
					pre: {
						children: getPhrasingContentSchema(),
					},
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( attributes ) =>
					createBlock( 'core/paragraph', attributes ),
			},
		],
	},

	edit( { attributes, setAttributes, className, isSelected } ) {
		const { content } = attributes;

		return [
			<RichText
				key="block"
				tagName="pre"
				value={ content }
				onChange={ ( nextContent ) => {
					setAttributes( {
						content: nextContent,
					} );
				} }
				placeholder={ __( 'Write preformatted text…' ) }
				wrapperClassName={ className }
				isSelected={ isSelected }
			/>,
		];
	},

	save( { attributes } ) {
		const { content } = attributes;

		return <pre>{ content }</pre>;
	},
};
