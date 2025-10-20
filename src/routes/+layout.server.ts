export function load({ cookies }) {
	const cactoideUserId = cookies.get('cactoideUserId');

	return {
		cactoideUserId
	};
}
